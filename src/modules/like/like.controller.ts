import { Request, Response, NextFunction } from "express";
import { getPostLikesService, toggleLikeService } from "./like.service";
import { AppError } from "../../errors/AppError";

export const toggleLike = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params as { postId: string };
    if (!req.userId) throw new AppError("Unauthorized", 401);

    const like = await toggleLikeService(postId, req.userId);

    res.status(200).json({
      status: "success",
      data: like,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const getPostLikes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params as { postId: string };
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

    const likes = await getPostLikesService(postId, page, limit);

    res.status(200).json({
      status: "success",
      data: likes,
    });
  } catch (error: unknown) {
    next(error);
  }
};
