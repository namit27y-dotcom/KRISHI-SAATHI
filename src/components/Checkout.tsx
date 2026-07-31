import React from "react";
import CheckoutFlow from "./CheckoutFlow";

interface CheckoutProps {
  order: {
    id: string;
    itemTitle: string;
    quantity: number;
    totalPrice: number;
    type: "crop" | "product";
    sellerName: string;
    deliveryAddress?: string;
  };
  user: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function Checkout({ order, user, onSuccess, onCancel }: CheckoutProps) {
  return (
    <CheckoutFlow 
      order={order}
      user={user}
      onSuccess={onSuccess}
      onCancel={onCancel}
    />
  );
}

export { Checkout };
