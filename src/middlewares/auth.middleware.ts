import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { prisma } from "../config/db";

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "You are not logged in",
      });
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);

    if (!payload?.userId) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, isActive: true, isBanned: true },
    });

    if (!user?.isActive) {
      return res
        .status(401)
        .json({ status: "error", message: "Account is deactivated" });
    }

    if (user?.isBanned) {
      return res
        .status(403)
        .json({ status: "error", message: "Account is banned" });
    }

    req.userId = payload.userId;

    next();
  } catch (error: unknown) {
    next(error);
  }
};

export const restrictTo = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { role: true },
      });

      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({
          status: "error",
          message: "You do not have permission",
        });
      }

      next();
    } catch (error: unknown) {
      next(error);
    }
  };
};
