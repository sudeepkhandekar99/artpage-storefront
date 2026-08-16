"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/currentUser";

export async function updateProfile(formData: FormData) {
  const user = await requireUser();
  const supabase = await createClient();

  const fullName = String(formData.get("fullName") || "").trim();
  const phone = String(formData.get("phone") || "").trim();

  const shippingAddress = {
    line1: String(formData.get("addressLine1") || "").trim(),
    line2: String(formData.get("addressLine2") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    state: String(formData.get("state") || "").trim(),
    postal_code: String(formData.get("postalCode") || "").trim(),
    country: String(formData.get("country") || "").trim(),
  };

  const { error } = await supabase.from("user_profiles").upsert({
    id: user.id,
    email: user.email,
    full_name: fullName,
    phone,
    shipping_address: shippingAddress,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    redirect(`/account?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/account");
  redirect("/account?message=Profile updated.");
}