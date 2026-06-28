import { Request, Response, NextFunction } from "express";
import {
  createPostService,
  deletePostService,
  getMyPostsService,
  updatePostService,
} from "./post.service";
import { AppError } from "../../errors/AppError";
import { CreatePostInput, UpdatePostInput } from "./post.validation";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) throw new AppError("Unauthorized", 401);

    const data: CreatePostInput = req.body;

    const post = await createPostService(req.userId, data);

    res.status(201).json({
      status: "success",
      data: post,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const getMyPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) throw new AppError("Unauthorized", 401);

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const posts = await getMyPostsService(req.userId, page, limit);

    res.status(200).json({
      status: "success",
      data: posts,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const updatePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) throw new AppError("Unauthorized", 401);

    const userId = req.userId;
    const { id } = req.params as { id: string };
    const data: UpdatePostInput = req.body;

    const updatedPost = await updatePostService(userId, id, data);

    res.status(200).json({
      status: "success",
      data: updatedPost,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) throw new AppError("Unauthorized", 401);

    const userId = req.userId;
    const { id } = req.params as { id: string };

    await deletePostService(userId, id);

    res.status(200).json({
      status: "success",
      message: "Post successfully deleted",
    });
  } catch (error: unknown) {
    next(error);
  }
};
