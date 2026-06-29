import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  fulfillCheckoutSession,
  markCheckoutSessionExpired,
  markCheckoutSessionFailed,
} from "@/lib/orders/fulfillment";

export const runtime = "nodejs";

async function registerStripeEvent(event: Stripe.Event) {
  const { error } = await supabaseAdmin.from("stripe_events").insert({
    id: event.id,
    type: event.type,
    processed: false,
  });

  if (!error) {
    return {
      shouldProcess: true,
    };
  }

  if (error.code !== "23505") {
    throw new Error(`Failed to register Stripe event: ${error.message}`);
  }

  const { data: existingEvent, error: existingError } = await supabaseAdmin
    .from("stripe_events")
    .select("processed")
    .eq("id", event.id)
    .single();

  if (existingError) {
    throw new Error(`Failed to read existing Stripe event: ${existingError.message}`);
  }

  return {
    shouldProcess: !existingEvent?.processed,
  };
}

async function markStripeEventProcessed(eventId: string) {
  await supabaseAdmin
    .from("stripe_events")
    .update({
      processed: true,
      processed_at: new Date().toISOString(),
      error: null,
    })
    .eq("id", eventId);
}

async function markStripeEventFailed(eventId: string, error: unknown) {
  await supabaseAdmin
    .from("stripe_events")
    .update({
      processed: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    .eq("id", eventId);
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);

    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  try {
    const registration = await registerStripeEvent(event);

    if (!registration.shouldProcess) {
      return NextResponse.json({
        received: true,
        duplicate: true,
      });
    }

    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await fulfillCheckoutSession(session.id);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await markCheckoutSessionExpired(session);
        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await markCheckoutSessionFailed(session);
        break;
      }

      default: {
        break;
      }
    }

    await markStripeEventProcessed(event.id);

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error("Stripe webhook processing failed:", error);
    await markStripeEventFailed(event.id, error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}