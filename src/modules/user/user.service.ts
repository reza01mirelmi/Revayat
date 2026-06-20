import { da } from "zod/v4/locales";
import { AppError } from "../../errors/AppError";
import { prisma } from "./../../config/db";
import { UpdateProfileInput, ChangePasswordInput } from "./user.validation";
import bcrypt from "bcrypt";

// View user profile publicly
export const getUserProfileService = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { username: true, bio: true, avatarUrl: true, createdAt: true },
  });

  if (!user) throw new AppError("User not found", 404);

  return user;
};

// Receive user posts
export const getUserPostsService = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      posts: {
        select: {
          id: true,
          title: true,
          content: true,
          viewsCount: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) throw new AppError("User not found", 404);

  return user.posts;
};

// Self profile update service
export const updateMyProfileService = async (
  userId: string,
  data: UpdateProfileInput,
) => {
  if (data.username) {
    const existingUser = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new AppError("Username already taken", 400);
    }
  }
  const updateUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.username !== undefined && { username: data.username }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
    },
    select: { username: true, bio: true, avatarUrl: true, createdAt: true },
  });

  return updateUser;
};

// Allows authenticated user to change their password

export const changePasswordService = async (
  userId: string,
  data: ChangePasswordInput,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new AppError("User not found", 404);

  const isValid = await bcrypt.compare(data.currentPassword, user.passwordHash);

  if (!isValid) throw new AppError("Current password is incorrect", 400);

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      passwordHash: hashedPassword,
    },
  });

  return updatedUser;
};

// Soft delete: deactivates user account and removes refresh token
export const deleteMyAccountService = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });

  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
};
