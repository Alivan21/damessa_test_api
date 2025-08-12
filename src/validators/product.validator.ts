import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().min(0).optional(),
  category_id: z.string().uuid(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().min(0),
  category_id: z.string().uuid(),
});
