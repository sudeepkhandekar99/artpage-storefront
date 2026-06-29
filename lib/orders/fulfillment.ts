import Stripe from "stripe";

import { stripe } from "@/lib/stripe/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendOrderEmails } from "@/lib/email/orderEmails";

export async function fulfillCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  if (session.payment_status !== "paid") {
    return {
      fulfilled: false,
      reason: `payment_status_${session.payment_status}`,
    };
  }

  const orderId = session.metadata?.order_id;

  if (!orderId) {
    throw new Error(`Checkout Session ${sessionId} missing order_id metadata`);
  }

  const { data, error } = await supabaseAdmin.rpc(
    "mark_order_paid_from_stripe",
    {
      p_order_id: orderId,
      p_checkout_session_id: session.id,
      p_payment_intent_id:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || null,
      p_stripe_customer_id:
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id || null,
      p_amount_total: session.amount_total || 0,
      p_currency: session.currency || "usd",
      p_payment_status: session.payment_status,
    }
  );

  if (error) {
    throw new Error(`Failed to mark order paid: ${error.message}`);
  }

  if (!data?.ok) {
    throw new Error(`Fulfillment failed: ${data?.reason || "unknown_error"}`);
  }

  if (!data.already_paid) {
    await sendOrderEmails(orderId);
  }

  return {
    fulfilled: true,
    alreadyPaid: Boolean(data.already_paid),
    orderId,
  };
}

export async function markCheckoutSessionExpired(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.order_id;

  if (!orderId) return;

  const { error } = await supabaseAdmin
    .from("orders")
    .update({
      status: "cancelled",
      stripe_checkout_session_id: session.id,
      stripe_payment_status: session.payment_status,
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .eq("status", "pending");

  if (error) {
    throw new Error(`Failed to mark order cancelled: ${error.message}`);
  }

  await supabaseAdmin.from("order_status_history").insert({
    order_id: orderId,
    status: "cancelled",
    note: "Stripe Checkout Session expired",
  });
}

export async function markCheckoutSessionFailed(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.order_id;

  if (!orderId) return;

  const { error } = await supabaseAdmin
    .from("orders")
    .update({
      status: "failed",
      stripe_checkout_session_id: session.id,
      stripe_payment_status: session.payment_status,
      failed_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .in("status", ["pending", "processing"]);

  if (error) {
    throw new Error(`Failed to mark order failed: ${error.message}`);
  }

  await supabaseAdmin.from("order_status_history").insert({
    order_id: orderId,
    status: "failed",
    note: "Stripe asynchronous payment failed",
  });
}