"use client";

import Link from "next/link";
import { ArrowLeft, Package, Truck } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { PageShell } from "@/components/ui/PageShell";
import { formatPrice } from "@/lib/products/utils";
import type { GuestCheckoutForm, ShippingMethod } from "@/lib/cart/types";
import { useCart } from "@/components/cart/CartProvider";

const initialForm: GuestCheckoutForm = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
  shippingMethod: "standard",
  notes: "",
};

const shippingPrices: Record<ShippingMethod, number> = {
  standard: 8,
  pickup: 0,
};

export function CheckoutClient() {
  const { items, subtotal } = useCart();

  const [form, setForm] = useState<GuestCheckoutForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const shipping = shippingPrices[form.shippingMethod];
  const total = subtotal + shipping;

  const canSubmit = useMemo(() => {
    if (items.length === 0) return false;

    return Boolean(
      form.email.trim() &&
        form.firstName.trim() &&
        form.lastName.trim() &&
        form.addressLine1.trim() &&
        form.city.trim() &&
        form.state.trim() &&
        form.postalCode.trim() &&
        form.country.trim()
    );
  }, [form, items.length]);

  function updateField<K extends keyof GuestCheckoutForm>(
    key: K,
    value: GuestCheckoutForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function submitCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) return;

    setSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: form,
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      window.location.href = data.url;
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to start checkout."
      );
      setSubmitting(false);
    }
  }

  return (
    <PageShell className="py-0">
      <section className="pb-16 pt-5">
        <Link
          href="/cart"
          className="soft-motion mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold shadow-sm hover:bg-white"
        >
          <ArrowLeft size={16} />
          Back to cart
        </Link>

        <div className="mb-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[#b9598c]">
            Guest checkout
          </p>

          <h1 className="mt-2 font-display text-6xl font-bold leading-none">
            Review your order
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            No account required. Add your contact and shipping details before
            secure Stripe payment.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="premium-card rounded-[2rem] p-8 text-center">
            <h2 className="font-display text-5xl font-bold">
              Your cart is empty
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Add a product before checkout.
            </p>

            <Link
              href="/store"
              className="soft-motion mt-7 inline-flex rounded-full bg-[#24171f] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#F9B2D7] hover:text-[#24171f]"
            >
              Browse store
            </Link>
          </div>
        ) : (
          <form
            onSubmit={submitCheckout}
            className="grid gap-6 lg:grid-cols-[1fr_380px]"
          >
            <div className="space-y-5">
              <div className="premium-card rounded-[2rem] p-5 sm:p-6">
                <h2 className="font-display text-4xl font-bold">Contact</h2>

                <div className="mt-5 grid gap-4">
                  <input
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    type="email"
                    placeholder="Email address"
                    className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none"
                    required
                  />

                  <input
                    value={form.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    placeholder="Phone number optional"
                    className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none"
                  />
                </div>
              </div>

              <div className="premium-card rounded-[2rem] p-5 sm:p-6">
                <h2 className="font-display text-4xl font-bold">
                  Shipping address
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <input
                    value={form.firstName}
                    onChange={(event) =>
                      updateField("firstName", event.target.value)
                    }
                    placeholder="First name"
                    className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none"
                    required
                  />

                  <input
                    value={form.lastName}
                    onChange={(event) =>
                      updateField("lastName", event.target.value)
                    }
                    placeholder="Last name"
                    className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none"
                    required
                  />

                  <input
                    value={form.addressLine1}
                    onChange={(event) =>
                      updateField("addressLine1", event.target.value)
                    }
                    placeholder="Address line 1"
                    className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none sm:col-span-2"
                    required
                  />

                  <input
                    value={form.addressLine2}
                    onChange={(event) =>
                      updateField("addressLine2", event.target.value)
                    }
                    placeholder="Apartment, suite, etc. optional"
                    className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none sm:col-span-2"
                  />

                  <input
                    value={form.city}
                    onChange={(event) =>
                      updateField("city", event.target.value)
                    }
                    placeholder="City"
                    className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none"
                    required
                  />

                  <input
                    value={form.state}
                    onChange={(event) =>
                      updateField("state", event.target.value)
                    }
                    placeholder="State"
                    className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none"
                    required
                  />

                  <input
                    value={form.postalCode}
                    onChange={(event) =>
                      updateField("postalCode", event.target.value)
                    }
                    placeholder="ZIP / postal code"
                    className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none"
                    required
                  />

                  <input
                    value={form.country}
                    onChange={(event) =>
                      updateField("country", event.target.value)
                    }
                    placeholder="Country"
                    className="h-12 rounded-full border border-[#ead8e2] bg-white px-5 text-sm font-semibold outline-none"
                    required
                  />
                </div>
              </div>

              <div className="premium-card rounded-[2rem] p-5 sm:p-6">
                <h2 className="font-display text-4xl font-bold">
                  Shipping method
                </h2>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => updateField("shippingMethod", "standard")}
                    className={`rounded-[1.4rem] border p-4 text-left transition ${
                      form.shippingMethod === "standard"
                        ? "border-[#F9B2D7] bg-white shadow-sm"
                        : "border-[#ead8e2] bg-white/70"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2 font-extrabold">
                      <Truck size={17} />
                      Standard shipping
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Carefully packed and shipped.
                    </p>
                    <p className="mt-3 font-extrabold">$8.00</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateField("shippingMethod", "pickup")}
                    className={`rounded-[1.4rem] border p-4 text-left transition ${
                      form.shippingMethod === "pickup"
                        ? "border-[#F9B2D7] bg-white shadow-sm"
                        : "border-[#ead8e2] bg-white/70"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2 font-extrabold">
                      <Package size={17} />
                      Local pickup
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Coordinate pickup directly.
                    </p>
                    <p className="mt-3 font-extrabold">Free</p>
                  </button>
                </div>

                <textarea
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  placeholder="Order note optional"
                  className="mt-4 min-h-28 w-full rounded-[1.5rem] border border-[#ead8e2] bg-white px-5 py-4 text-sm font-semibold outline-none"
                />
              </div>
            </div>

            <aside className="premium-card h-fit rounded-[2rem] p-5 lg:sticky lg:top-24">
              <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-[#b9598c]">
                Order summary
              </p>

              <div className="mt-5 grid gap-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[64px_1fr] gap-3 rounded-[1.25rem] bg-white/75 p-3"
                  >
                    <div className="flex aspect-square items-center justify-center rounded-xl bg-[#fff8fc] p-2">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="h-full w-full rounded-lg bg-[#f8eff4]" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <p className="line-clamp-2 text-sm font-extrabold leading-5">
                          {item.name}
                        </p>
                        <p className="text-sm font-extrabold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>

                      <p className="mt-1 text-xs font-bold text-muted-foreground">
                        Qty {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3 border-t border-[#ead8e2] pt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="font-extrabold">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-muted-foreground">
                    Shipping
                  </span>
                  <span className="font-extrabold">
                    {formatPrice(shipping)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-[#ead8e2] pt-4">
                  <span className="font-extrabold">Total</span>
                  <span className="text-2xl font-extrabold">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="soft-motion mt-6 h-12 w-full rounded-full bg-[#F9B2D7] px-5 text-sm font-extrabold text-[#24171f] shadow-sm hover:bg-[#f69cca] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Opening Stripe..." : "Continue to payment"}
              </button>

              <p className="mt-4 text-xs leading-6 text-muted-foreground">
                Payment is handled securely by Stripe. Your order is marked paid
                only after Stripe confirms payment.
              </p>
            </aside>
          </form>
        )}
      </section>
    </PageShell>
  );
}