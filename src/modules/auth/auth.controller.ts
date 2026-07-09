import { Request, Response, NextFunction } from "express";
import {
  getMeService,
  loginService,
  logoutService,
  refreshService,
  registerService,
} from "./auth.service";
import { AppError } from "../../errors/AppError";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, accessToken, refreshToken } = await registerService(req.body);

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(201).json({
      status: "success",
      data: { user, accessToken },
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, accessToken, refreshToken } = await loginService(req.body);

    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.status(200).json({
      status: "success",
      data: { user, accessToken },
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Refresh token not found",
      });
    }

    const { accessToken } = await refreshService(token);

    res.status(200).json({
      status: "success",
      data: { accessToken },
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      await logoutService(token);
    }

    res.clearCookie("refreshToken");

    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) throw new AppError("Unauthorized", 401);
    const userId = req.userId;
    const user = await getMeService(userId);

    res.status(200).json({
      status: "success",
      data: { user },
    });
  } catch (error: unknown) {
    next(error);
  }
};
