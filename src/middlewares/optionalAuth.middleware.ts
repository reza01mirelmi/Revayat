import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { prisma } from "../config/db";

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.slice(7).trim();
    if (!token) return next();
    const payload = verifyAccessToken(token);

    if (!payload?.userId) {
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, isActive: true, isBanned: true, role: true },
    });

    if (!user || !user.isActive || user.isBanned) {
      return next();
    }

    req.userId = payload.userId;
    req.userRole = user.role;

    next();
  } catch (err) {
    console.error("optionalAuth error:", err);
    next();
  }
};
