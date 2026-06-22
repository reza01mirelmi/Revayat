import { Request, Response, NextFunction } from "express";
import { createPostService } from "./post.service";
import { AppError } from "../../errors/AppError";
import { CreatePostInput } from "./post.validation";

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) throw new AppError("Unauthorized", 401);

    const post = await createPostService(req.userId, req.body);

    res.status(201).json({
      status: "success",
      data: { post },
    });
  } catch (error: unknown) {
    next(error);
  }
};
