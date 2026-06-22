import { AppError } from "../../errors/AppError";
import { prisma } from "./../../config/db";
import {
  UpdateProfileInput,
  ChangePasswordInput,
  UpdateRoleInput,
} from "./user.validation";
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

/**
 * Receive user posts
 */
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

/**
 * Self profile update service
 */
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

/**
 * Allows authenticated user to change their password
 */
export const changePasswordService = async (
  userId: string,
  data: ChangePasswordInput,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new AppError("User not found", 404);

  const isValid = await bcrypt.compare(data.currentPassword, user.passwordHash);

  if (!isValid) throw new AppError("Current password is incorrect", 400);

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      passwordHash: hashedPassword,
    },
  });
};

/**
 * Soft delete: deactivates user account and removes refresh token
 */
export const deleteMyAccountService = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });

  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
};

/**
 * Get all users with pagination (Admin only)
 */
export const getAllUsersService = async (
  page: number,
  limit: number,
  search?: string,
) => {
  const where = search
    ? {
        OR: [
          { username: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};
  const skip = (page - 1) * limit;

  const [total, users] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      omit: {
        passwordHash: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get a single user by ID (Admin only)
 */
export const getUserByIdService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      bio: true,
      isActive: true,
      isBanned: true,
      createdAt: true,
      posts: {
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          posts: true,
          comments: true,
          likes: true,
        },
      },
    },
  });

  if (!user) throw new AppError("User not found", 404);

  return user;
};

/**
 * Update user role (Admin only)
 */
export const updateUserRoleService = async (
  userId: string,
  role: UpdateRoleInput,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new AppError("User not found", 404);

  if (user.role === role.role) {
    throw new AppError(`User is already ${role.role}`, 400);
  }

  const updateRole = await prisma.user.update({
    where: { id: userId },
    data: { role: role.role },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });

  return updateRole;
};

/**
 * Ban And Unban a user by ID (Admin only)
 */
export const toggleBanUserService = async (
  userId: string,
  isBanned: boolean,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new AppError("User not found", 404);

  if (user.isBanned === isBanned) {
    throw new AppError(
      isBanned ? "User is already banned" : "User is not banned",
      400,
    );
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { isBanned },
    select: { id: true, username: true, email: true, isBanned: true },
  });
};

/**
 * Permanently delete a user by ID (Admin only)
 */
export const deleteUserService = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new AppError("User not found", 404);

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });

  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
};
