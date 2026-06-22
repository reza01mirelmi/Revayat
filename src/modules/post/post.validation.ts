import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title should not exceed 100 characters"),

  content: z
    .string({ message: "Content is required" })
    .trim()
    .min(50, "Content must be at least 50 characters"),

  categoryId: z
    .string({ message: "Category is required" })
    .uuid("Category ID is not valid"),

  tags: z
    .array(z.string().uuid("Tag ID is not valid"))
    .max(5, "You can add up to 5 tags")
    .optional(),
});

export const updatePostSchema = z
  .object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title should not exceed 100 characters")
      .trim()
      .optional(),

    content: z
      .string()
      .min(50, "Content must be at least 50 characters")
      .trim()
      .optional(),

    categoryId: z.string().uuid("Category ID is not valid").optional(),

    tags: z
      .array(z.string().uuid("Tag ID is not valid"))
      .max(5, "You can add up to 5 tags")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update",
  });

export const updatePostStatusSchema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED", "BANNED"], {
    message: "Status must be DRAFT, PUBLISHED or BANNED",
  }),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type UpdatePostStatusInput = z.infer<typeof updatePostStatusSchema>;
