import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getProductImageUrl } from "@/lib/products/utils";
import type { Product } from "@/lib/products/types";

type CheckoutCartItem = {
  id: string;
  quantity: number;
};

type CheckoutCustomer = {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  shippingMethod: "standard" | "pickup";
  notes?: string;
};

type CheckoutRequestBody = {
  items: CheckoutCartItem[];
  customer: CheckoutCustomer;
};

function dollarsToCents(value: number | string) {
  return Math.round(Number(value || 0) * 100);
}

function getShippingCents(method: CheckoutCustomer["shippingMethod"]) {
  return method === "pickup" ? 0 : 800;
}

function validateBody(body: CheckoutRequestBody) {
  if (!body.customer?.email?.trim()) {
    throw new Error("Customer email is required.");
  }

  if (!body.customer?.firstName?.trim()) {
    throw new Error("First name is required.");
  }

  if (!body.customer?.lastName?.trim()) {
    throw new Error("Last name is required.");
  }

  if (!body.customer?.addressLine1?.trim()) {
    throw new Error("Shipping address is required.");
  }

  if (!body.customer?.city?.trim()) {
    throw new Error("City is required.");
  }

  if (!body.customer?.state?.trim()) {
    throw new Error("State is required.");
  }

  if (!body.customer?.postalCode?.trim()) {
    throw new Error("Postal code is required.");
  }

  if (!body.customer?.country?.trim()) {
    throw new Error("Country is required.");
  }

  if (!body.items || body.items.length === 0) {
    throw new Error("Cart is empty.");
  }

  for (const item of body.items) {
    if (!item.id || !item.quantity || item.quantity < 1) {
      throw new Error("Invalid cart item.");
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutRequestBody;
    validateBody(body);

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const authSupabase = await createClient();

    const {
      data: { user },
    } = await authSupabase.auth.getUser();

    const productIds = body.items.map((item) => item.id);

    const { data: products, error: productsError } = await supabaseAdmin
      .from("products")
      .select(
        `
          id,
          name,
          description,
          price,
          dimensions,
          category,
          sku,
          png_image_path,
          jpg_image_path,
          alt_text,
          status,
          featured,
          metadata,
          created_at,
          updated_at
        `
      )
      .in("id", productIds)
      .eq("status", "active");

    if (productsError) {
      throw new Error(productsError.message);
    }

    const productMap = new Map<string, Product>(
      ((products || []) as Product[]).map((product) => [product.id, product])
    );

    const normalizedItems = body.items.map((item) => {
      const product = productMap.get(item.id);

      if (!product) {
        throw new Error("A product in your cart is no longer available.");
      }

      const quantity = Math.max(1, Number(item.quantity || 1));
      const unitAmount = dollarsToCents(product.price);
      const lineTotal = unitAmount * quantity;
      const imageUrl = getProductImageUrl(product);

      if (unitAmount <= 0) {
        throw new Error(`${product.name} has an invalid price.`);
      }

      return {
        product,
        quantity,
        unitAmount,
        lineTotal,
        imageUrl,
      };
    });

    const subtotalCents = normalizedItems.reduce(
      (sum, item) => sum + item.lineTotal,
      0
    );

    const shippingCents = getShippingCents(body.customer.shippingMethod);
    const taxCents = 0;
    const totalCents = subtotalCents + shippingCents + taxCents;

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user?.id || null,
        status: "pending",

        customer_email: body.customer.email.trim(),
        customer_first_name: body.customer.firstName.trim(),
        customer_last_name: body.customer.lastName.trim(),
        customer_phone: body.customer.phone?.trim() || null,

        shipping_method: body.customer.shippingMethod,
        shipping_address: {
          line1: body.customer.addressLine1.trim(),
          line2: body.customer.addressLine2?.trim() || "",
          city: body.customer.city.trim(),
          state: body.customer.state.trim(),
          postal_code: body.customer.postalCode.trim(),
          country: body.customer.country.trim(),
        },
        customer_notes: body.customer.notes?.trim() || null,

        currency: "usd",
        subtotal_cents: subtotalCents,
        shipping_cents: shippingCents,
        tax_cents: taxCents,
        total_cents: totalCents,

        metadata: {
          source: user ? "account_checkout" : "guest_checkout",
        },
      })
      .select("*")
      .single();

    if (orderError || !order) {
      throw new Error(orderError?.message || "Failed to create order.");
    }

    const orderItems = normalizedItems.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_category: item.product.category,
      product_dimensions: item.product.dimensions,
      product_image_url: item.imageUrl,
      unit_price_cents: item.unitAmount,
      quantity: item.quantity,
      line_total_cents: item.lineTotal,
      product_snapshot: item.product,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      throw new Error(itemsError.message);
    }

    await supabaseAdmin.from("order_status_history").insert({
      order_id: order.id,
      status: "pending",
      note: "Checkout Session created",
    });

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      normalizedItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: item.unitAmount,
          product_data: {
            name: item.product.name,
            description: item.product.description || undefined,
            images: item.imageUrl ? [item.imageUrl] : undefined,
            metadata: {
              product_id: item.product.id,
              category: item.product.category,
            },
          },
        },
      }));

    if (shippingCents > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: shippingCents,
          product_data: {
            name: "Standard shipping",
            description: "Shipping for handmade artwork order",
            metadata: {
              product_id: "shipping",
              category: "shipping",
            },
          },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: body.customer.email.trim(),
      line_items: lineItems,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout`,
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
      },
      payment_intent_data: {
        metadata: {
          order_id: order.id,
          order_number: order.order_number,
        },
      },
    });

    const { error: sessionUpdateError } = await supabaseAdmin
      .from("orders")
      .update({
        stripe_checkout_session_id: session.id,
        stripe_payment_status: session.payment_status,
      })
      .eq("id", order.id);

    if (sessionUpdateError) {
      throw new Error(sessionUpdateError.message);
    }

    return NextResponse.json({
      url: session.url,
      orderId: order.id,
    });
  } catch (error) {
    console.error("Checkout API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create checkout session.",
      },
      { status: 400 }
    );
  }
}