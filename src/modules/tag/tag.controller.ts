import { Request, Response, NextFunction } from "express";
import {
  getAllTagsService,
  getTagBySlugService,
  createTagService,
  updateTagService,
  deleteTagService,
} from "./tag.service";
import { CreateTagInput, UpdateTagInput } from "./tag.validation";

export const getAllTags = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const tags = await getAllTagsService();

    res.status(200).json({
      status: "success",
      data: tags,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const getTagBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug } = req.params as { slug: string };
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

    const tag = await getTagBySlugService(slug, page, limit);

    res.status(200).json({
      status: "success",
      data: tag,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const createTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: CreateTagInput = req.body;

    const tag = await createTagService(data);

    res.status(201).json({
      status: "success",
      data: tag,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const updateTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };

    const data: UpdateTagInput = req.body;

    const tag = await updateTagService(id, data);

    res.status(200).json({
      status: "success",
      data: tag,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };

    await deleteTagService(id);

    res.status(200).json({
      status: "success",
      message: "Tag successfully deleted",
    });
  } catch (error: unknown) {
    next(error);
  }
};
