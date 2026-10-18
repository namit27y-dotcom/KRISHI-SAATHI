import { z } from "zod";

export const cropListingSchema = z.object({
  cropName: z.string().min(2, "Crop name is required"),
  cropCategory: z.string().optional().default("Grain"),
  quantity: z.union([z.number(), z.string()]).transform(v => parseFloat(String(v)) || 1),
  unit: z.string().min(1, "Unit is required"),
  pricePerUnit: z.union([z.number(), z.string()]).transform(v => parseFloat(String(v)) || 1),
  harvestDate: z.string().optional(),
  description: z.string().optional().default(""),
  imageUrl: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  category: z.string().min(2, "Category is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  price: z.union([z.number(), z.string()]).transform(v => parseFloat(String(v)) || 1),
  unit: z.string().min(1, "Unit is required"),
  inventory: z.union([z.number(), z.string()]).transform(v => parseInt(String(v), 10) || 0),
  imageUrl: z.string().optional(),
});

export const orderCreateSchema = z.object({
  type: z.enum(["crop", "product"]),
  listingOrProductId: z.string().min(1, "Item reference is required"),
  quantity: z.union([z.number(), z.string()]).transform(v => parseFloat(String(v)) || 1),
  deliveryAddress: z.string().optional().default("APMC Market Yard"),
  paymentMethod: z.string().optional().default("UPI"),
});

export const orderUpdateSchema = z.object({
  status: z.enum(["pending", "accepted", "rejected", "paid", "shipped", "delivered", "cancelled"]).optional(),
  paymentStatus: z.enum(["unpaid", "paid", "pending_payment", "failed"]).optional(),
});

export const paymentInitiateSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  gateway: z.string().optional().default("razorpay"),
  upiId: z.string().optional().default("user@pay"),
});

export const paymentVerifySchema = z.object({
  paymentId: z.string().min(1, "Payment ID is required"),
  status: z.enum(["successful", "failed", "cancelled"]),
  signature: z.string().optional(),
});

export const chatMessageSchema = z.object({
  receiverId: z.string().min(1, "Receiver ID is required"),
  receiverName: z.string().optional().default("Receiver"),
  message: z.string().min(1, "Message content cannot be empty"),
});

export const reviewSchema = z.object({
  itemType: z.enum(["crop", "product", "seller"]),
  itemId: z.string().min(1, "Item ID is required"),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().optional().default(""),
});
