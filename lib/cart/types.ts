export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
  category: string;
  dimensions: string | null;
};

export type ShippingMethod = "standard" | "pickup";

export type GuestCheckoutForm = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  shippingMethod: ShippingMethod;
  notes: string;
};