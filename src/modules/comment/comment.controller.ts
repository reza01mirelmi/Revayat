import { Request, Response, NextFunction } from "express";
import {
  createCommentService,
  deleteCommentService,
  getAllCommentsService,
  updateCommentService,
} from "./comment.service";
import { AppError } from "../../errors/AppError";
import { CreateCommentInput, UpdateCommentInput } from "./comment.validation";

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params as { postId: string };
    const data: CreateCommentInput = req.body;

    if (!req.userId) throw new AppError("Unauthorized", 401);

    const userId = req.userId;

    const comment = await createCommentService(postId, userId, data);

    res.status(201).json({
      status: "success",
      data: comment,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId, id } = req.params as { postId: string; id: string };

    if (!req.userId) throw new AppError("Unauthorized", 401);

    const userId = req.userId;
    const data: UpdateCommentInput = req.body;

    const comment = await updateCommentService(postId, id, userId, data);

    res.status(200).json({
      status: "success",
      data: comment,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId, id } = req.params as { postId: string; id: string };

    if (!req.userId) throw new AppError("Unauthorized", 401);

    const userId = req.userId;

    await deleteCommentService(id, postId, userId);

    res.status(200).json({
      status: "success",
      message: "Comment successfully deleted",
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const getAllComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { postId } = req.params as { postId: string };
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

    const comments = await getAllCommentsService(postId, page, limit);

    res.status(200).json({
      status: "success",
      data: comments,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteCommentAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };

    await deleteCommentService(id);

    res.status(200).json({
      status: "success",
      message: "Comment successfully deleted",
    });
  } catch (error: unknown) {
    next(error);
  }
};
