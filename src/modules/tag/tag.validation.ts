import { z } from "zod";

const tagSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name should not exceed 30 characters"),

  slug: z
    .string({ message: "Slug is required" })
    .min(2, "Slug must be at least 2 characters")
    .max(30, "Slug should not exceed 30 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and -",
    ),
});

export const createTagSchema = tagSchema;

export const updateTagSchema = tagSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
