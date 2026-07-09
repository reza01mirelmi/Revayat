import { Request, Response, NextFunction } from "express";
import {
  createPostService,
  getMyPostsService,
  updatePostService,
  deletePostService,
  getAllPostsService,
  getPostByIdService,
  getPostsByFilterService,
  getRelatedPostsService,
  updatePostStatusService,
} from "./post.service";
import { AppError } from "../../errors/AppError";
import {
  CreatePostInput,
  UpdatePostInput,
  UpdatePostStatusInput,
} from "./post.validation";

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

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

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

    await deletePostService(id, userId);

    res.status(200).json({
      status: "success",
      message: "Post successfully deleted",
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const posts = await getAllPostsService(page, limit, search, false);

    res.status(200).json({
      status: "success",
      data: posts,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const getPostById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };

    const post = await getPostByIdService(id);

    res.status(200).json({
      status: "success",
      data: post,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const getPostsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categorySlug } = req.params as { categorySlug: string };
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const posts = await getPostsByFilterService(
      { categorySlug },
      page,
      limit,
      search,
    );

    res.status(200).json({
      status: "success",
      data: posts,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const getPostsByTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { tagSlug } = req.params as { tagSlug: string };
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const posts = await getPostsByFilterService(
      { tagSlug },
      page,
      limit,
      search,
    );

    res.status(200).json({
      status: "success",
      data: posts,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const getRelatedPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };

    const relatedPosts = await getRelatedPostsService(id);

    res.status(200).json({
      status: "success",
      data: relatedPosts,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const getAllPostsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;

    const posts = await getAllPostsService(page, limit, search, true);

    res.status(200).json({
      status: "success",
      data: posts,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const deletePostAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };

    await deletePostService(id);

    res.status(200).json({
      status: "success",
      message: "Post successfully deleted",
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const updatePostStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };
    const { status } = req.body as UpdatePostStatusInput;

    const post = await updatePostStatusService(id, status);

    res.status(200).json({
      status: "success",
      message: "Post status updated successfully",
      data: post,
    });
  } catch (error: unknown) {
    next(error);
  }
};
