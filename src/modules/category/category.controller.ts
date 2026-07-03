import { Request, Response, NextFunction } from "express";
import {
  getAllCategoriesService,
  getCategoryBySlugService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from "./category.service";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.validation";

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await getAllCategoriesService();

    res.status(200).json({
      status: "success",
      data: categories,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const getCategoryBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug } = req.params as { slug: string };

    const category = await getCategoryBySlugService(slug);

    res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data: CreateCategoryInput = req.body;

    const category = await createCategoryService(data);

    res.status(201).json({
      status: "success",
      data: category,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };

    const data: UpdateCategoryInput = req.body;

    const category = await updateCategoryService(id, data);

    res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params as { id: string };

    await deleteCategoryService(id);

    res.status(200).json({
      status: "success",
      message: "Category successfully deleted",
    });
  } catch (error: unknown) {
    next(error);
  }
};
