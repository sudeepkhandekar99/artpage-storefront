import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { formatPrice } from "@/lib/products/utils";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const fromEmail =
  process.env.RESEND_FROM_EMAIL || "Ranin Art <onboarding@resend.dev>";

function centsToPrice(value: number | null | undefined) {
  return formatPrice((value || 0) / 100);
}

function getOrderHtml({
  title,
  order,
  items,
}: {
  title: string;
  order: any;
  items: any[];
}) {
  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eee;">
            <strong>${item.product_name}</strong><br/>
            <span style="color:#777;font-size:13px;">
              ${item.product_category || "Artwork"} · Qty ${item.quantity}
            </span>
          </td>
          <td align="right" style="padding:12px 0;border-bottom:1px solid #eee;">
            ${centsToPrice(item.line_total_cents)}
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;background:#fffaf7;padding:24px;color:#24171f;">
      <div style="max-width:620px;margin:0 auto;background:white;border-radius:24px;padding:28px;border:1px solid #ead8e2;">
        <p style="text-transform:uppercase;letter-spacing:0.22em;color:#b9598c;font-size:12px;font-weight:800;margin:0 0 12px;">
          Ranin Art
        </p>

        <h1 style="font-size:32px;line-height:1.05;margin:0 0 12px;">
          ${title}
        </h1>

        <p style="color:#666;line-height:1.7;margin:0 0 24px;">
          Order <strong>${order.order_number}</strong> is now marked as <strong>${order.status}</strong>.
        </p>

        <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
          ${itemRows}
        </table>

        <div style="margin-top:22px;border-top:1px solid #ead8e2;padding-top:18px;">
          <p style="margin:0 0 8px;display:flex;justify-content:space-between;">
            <span>Subtotal</span>
            <strong>${centsToPrice(order.subtotal_cents)}</strong>
          </p>
          <p style="margin:0 0 8px;display:flex;justify-content:space-between;">
            <span>Shipping</span>
            <strong>${centsToPrice(order.shipping_cents)}</strong>
          </p>
          <p style="margin:16px 0 0;font-size:20px;display:flex;justify-content:space-between;">
            <span>Total</span>
            <strong>${centsToPrice(order.total_cents)}</strong>
          </p>
        </div>

        <div style="margin-top:24px;background:#fff8fc;border-radius:18px;padding:16px;">
          <p style="margin:0;font-size:14px;line-height:1.7;color:#555;">
            Handmade pieces may need processing time before shipment. You will receive updates as the order moves forward.
          </p>
        </div>
      </div>
    </div>
  `;
}

export async function sendOrderEmails(orderId: string) {
  if (!resend) {
    console.warn("RESEND_API_KEY missing. Skipping order emails.");
    return;
  }

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    throw new Error(`Could not fetch order for email: ${orderError?.message}`);
  }

  const { data: items, error: itemsError } = await supabaseAdmin
    .from("order_items")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (itemsError) {
    throw new Error(`Could not fetch order items for email: ${itemsError.message}`);
  }

  const safeItems = items || [];

  if (!order.confirmation_email_sent_at) {
    await resend.emails.send({
      from: fromEmail,
      to: order.customer_email,
      subject: `Your Ranin Art order ${order.order_number} is confirmed`,
      html: getOrderHtml({
        title: "Your order is confirmed",
        order,
        items: safeItems,
      }),
    });

    await supabaseAdmin
      .from("orders")
      .update({ confirmation_email_sent_at: new Date().toISOString() })
      .eq("id", orderId);
  }

  if (process.env.ADMIN_EMAIL && !order.admin_email_sent_at) {
    await resend.emails.send({
      from: fromEmail,
      to: process.env.ADMIN_EMAIL,
      subject: `New paid order: ${order.order_number}`,
      html: getOrderHtml({
        title: "New paid order",
        order,
        items: safeItems,
      }),
    });

    await supabaseAdmin
      .from("orders")
      .update({ admin_email_sent_at: new Date().toISOString() })
      .eq("id", orderId);
  }
}