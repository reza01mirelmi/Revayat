import { Request, Response, NextFunction } from "express";

import {
  changePasswordService,
  deleteMyAccountService,
  getUserPostsService,
  getUserProfileService,
  updateMyProfileService,
} from "./user.service";
import { AppError } from "../../errors/AppError";

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username } = req.params as { username: string };

    const user = await getUserProfileService(username);

    res.status(200).json({ status: "success", data: { user } });
  } catch (error) {
    next(error);
  }
};

export const getUserPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username } = req.params as { username: string };

    const posts = await getUserPostsService(username);

    res.status(200).json({ status: "success", data: { posts } });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) throw new AppError("Unauthorized", 401);

    const userId = req.userId!;

    const updateUser = await updateMyProfileService(userId, req.body);

    res.status(200).json({
      status: "success",
      data: updateUser,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) throw new AppError("Unauthorized", 401);

    const userId = req.userId;

    await changePasswordService(userId, req.body);

    res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) throw new AppError("Unauthorized", 401);

    const userId = req.userId;

    await deleteMyAccountService(userId);

    res.clearCookie("refreshToken");

    res.status(200).json({
      status: "success",
      message: "Your account has been deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};
