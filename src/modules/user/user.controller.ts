import { Request, Response, NextFunction } from "express";
import {
  changePasswordService,
  deleteMyAccountService,
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  getUserPostsService,
  getUserProfileService,
  toggleBanUserService,
  updateMyProfileService,
  updateUserRoleService,
} from "./user.service";
import { AppError } from "../../errors/AppError";
import { UpdateRoleInput } from "./user.validation";
import { verifyRealImageType } from "../../utils/verify-image";
import { uploadBufferToCloudinary } from "../../utils/cloudinary-upload";

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username } = req.params as { username: string };

    const user = await getUserProfileService(username);

    res.status(200).json({ status: "success", data: { user } });
  } catch (error: unknown) {
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
  } catch (error: unknown) {
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
    const userId = req.userId;

    const updateUser = await updateMyProfileService(userId, req.body);

    res.status(200).json({
      status: "success",
      data: updateUser,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const uploadAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) throw new AppError("Unauthorized", 401);
    if (!req.file) throw new AppError("No file was provided.", 400);

    const isValidImage = await verifyRealImageType(req.file.buffer);
    if (!isValidImage) {
      throw new AppError("The uploaded file is not a valid image.", 400);
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: "revayat/avatars",
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
      ],
    });

    const updatedUser = await updateMyProfileService(req.userId, {
      avatarUrl: result.secure_url,
      avatarPublicId: result.public_id,
    });

    res.status(200).json({
      status: "success",
      data: updatedUser,
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
  } catch (error: unknown) {
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
  } catch (error: unknown) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const result = await getAllUsersService(page, limit, search);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };

    const user = await getUserByIdService(id);

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };

    const role: UpdateRoleInput = req.body;

    const user = await updateUserRoleService(id, role);

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const banUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };

    const user = await toggleBanUserService(id, true);

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const unbanUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };

    const user = await toggleBanUserService(id, false);

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };

    await deleteUserService(id);

    res.status(200).json({
      status: "success",
      message: "User has been deactivated successfully",
    });
  } catch (error: unknown) {
    next(error);
  }
};
