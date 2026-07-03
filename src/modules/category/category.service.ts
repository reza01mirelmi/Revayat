import { AppError } from "../../errors/AppError";
import { prisma } from "./../../config/db";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.validation";

/**
 * Get all categories (public).
 */
export const getAllCategoriesService = async () => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return categories;
};

/**
 * Get a category by its slug (public).
 */
export const getCategoryBySlugService = async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      posts: {
        select: {
          id: true,
          title: true,
          content: true,
          viewsCount: true,
          createdAt: true,
        },
      },
    },
  });

  if (!category) throw new AppError("Category not found", 404);

  return category;
};

/**
 * Create a new category (Admin only).
 */
export const createCategoryService = async (data: CreateCategoryInput) => {
  const category = await prisma.category.create({
    data,
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return category;
};

/**
 * Update an existing category (Admin only).
 */
export const updateCategoryService = async (
  categoryId: string,
  data: UpdateCategoryInput,
) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) throw new AppError("Category not found", 404);

  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.slug !== undefined && { slug: data.slug }),
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return updatedCategory;
};

/**
 * Delete an existing category (Admin only).
 */
export const deleteCategoryService = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) throw new AppError("Category not found", 404);

  await prisma.category.delete({ where: { id: categoryId } });
};
