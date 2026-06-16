import { z } from "zod";

const contentSchema = z
  .string({ message: "Content is required" })
  .trim()
  .min(1, "Comment cannot be empty")
  .max(500, "Comment should not exceed 500 characters");

export const createCommentSchema = z.object({
  content: contentSchema,
});

export const updateCommentSchema = createCommentSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
