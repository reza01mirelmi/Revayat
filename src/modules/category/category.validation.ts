import { z } from "zod";

const categorySchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name should not exceed 50 characters"),

  slug: z
    .string({ message: "Slug is required" })
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug should not exceed 50 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and -",
    ),
});

// create category
export const createCategorySchema = categorySchema;

// update category
export const updateCategorySchema = categorySchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
