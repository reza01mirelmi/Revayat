import { Request, Response, NextFunction } from "express";
import {
  getMyBookmarksService,
  toggleBookmarkService,
} from "./bookmark.service";
import { AppError } from "../../errors/AppError";

export const toggleBookmark = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params as { postId: string };
    if (!req.userId) throw new AppError("Unauthorized", 401);

    const bookmark = await toggleBookmarkService(postId, req.userId);

    res.status(200).json({
      status: "success",
      data: bookmark,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const getMyBookmarks = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) throw new AppError("Unauthorized", 401);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

    const bookmarks = await getMyBookmarksService(req.userId, page, limit);

    res.status(200).json({
      status: "success",
      data: bookmarks,
    });
  } catch (error: unknown) {
    next(error);
  }
};
