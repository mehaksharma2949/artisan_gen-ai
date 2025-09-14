import z from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  user_type: z.enum(["artisan", "buyer"]),
  full_name: z.string().nullable(),
  phone: z.string().nullable(),
  profile_image: z.string().nullable(),
  location: z.string().nullable(),
  bio: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ArtisanProfileSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  craft_type: z.string().nullable(),
  years_experience: z.number().nullable(),
  specialty: z.string().nullable(),
  story: z.string().nullable(),
  workshop_location: z.string().nullable(),
  social_media_links: z.string().nullable(),
  is_verified: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ProductSchema = z.object({
  id: z.number(),
  artisan_id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  category: z.string().nullable(),
  images: z.string().nullable(),
  stock_quantity: z.number(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const OrderSchema = z.object({
  id: z.number(),
  buyer_id: z.string(),
  artisan_id: z.string(),
  product_id: z.number(),
  quantity: z.number(),
  total_amount: z.number(),
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
  shipping_address: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type UserType = z.infer<typeof UserSchema>;
export type ArtisanProfileType = z.infer<typeof ArtisanProfileSchema>;
export type ProductType = z.infer<typeof ProductSchema>;
export type OrderType = z.infer<typeof OrderSchema>;
