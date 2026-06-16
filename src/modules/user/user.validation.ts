import { z } from "zod";

// Authentication for Register
export const registerSchema = z.object({
  username: z
    .string({ message: "Username is required" })
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username should not be longer than 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain English letters, numbers, and _",
    )
    .trim(),

  email: z
    .string({ message: "Email is required" })
    .email("Email format is not correct")
    .trim(),

  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters long."),
});

// Authentication for login
export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Email format is not correct")
    .trim(),

  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"),
});

// Update user profile
export const updateProfileSchema = z.object({
  username: z
    .string({ message: "Username is required" })
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username should not be longer than 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain English letters, numbers, and _",
    )
    .trim()
    .optional(),

  bio: z
    .string()
    .max(200, "Bio should not exceed 200 characters")
    .trim()
    .optional(),

  avatarUrl: z
    .string()
    .url("The image address format is not correct")
    .optional(),
});

// Change user password
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ message: "Current password is required" })
      .min(1, "Current password is required"),

    newPassword: z
      .string({ message: "New password required" })
      .min(8, "The new password must be at least 8 characters long."),

    confirmPassword: z
      .string({ message: "Password confirmation is required" })
      .min(1, "Password confirmation is required."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "The new password and its confirmation are not the same",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
