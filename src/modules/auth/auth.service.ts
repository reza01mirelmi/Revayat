import bcrypt from "bcrypt";
import { prisma } from "./../../config/db";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "./../../utils/jwt";
import { RegisterInput, LoginInput } from "./../user/user.validation";
import { AppError } from "../../errors/AppError";

// Register user
export const registerService = async (data: RegisterInput) => {
  const emailExists = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (emailExists) {
    throw new AppError("Email already exists", 409);
  }

  const usernameExists = await prisma.user.findUnique({
    where: { username: data.username },
  });

  if (usernameExists) {
    throw new AppError("Username already exists", 409);
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash,
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { user, accessToken, refreshToken };
};

// // Login user
export const loginService = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  await prisma.refreshToken.deleteMany({
    where: { userId: user.id },
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const { passwordHash, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken };
};

export const refreshService = async (token: string) => {
  const payload = verifyRefreshToken(token);

  const savedToken = await prisma.refreshToken.findUnique({ where: { token } });

  if (!savedToken || savedToken.expiresAt < new Date()) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const accessToken = generateAccessToken(payload.userId);

  return { accessToken };
};

export const logoutService = async (token: string) => {
  await prisma.refreshToken.delete({
    where: { token },
  });
};

export const getMeService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      bio: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
    },
  });
  if (!user) throw new AppError("User not found", 404);

  return user;
};
