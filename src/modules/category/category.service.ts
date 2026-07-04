import { AppError } from "../../errors/AppError";
import { PostStatus } from "../../generated/prisma";
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
export const getCategoryBySlugService = async (
  slug: string,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const category = await prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      posts: {
        where: {
          status: PostStatus.PUBLISHED,
        },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          status: true,
          viewsCount: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          posts: { where: { status: PostStatus.PUBLISHED } },
        },
      },
    },
  });

  if (!category) throw new AppError("Category not found", 404);

  const total = category._count.posts;

  return {
    category: {
      id: category.id,
      name: category.name,
      slug: category.slug,
      posts: category.posts,
    },
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Create a new category (Admin only).
 */
export const createCategoryService = async (data: CreateCategoryInput) => {
  const existing = await prisma.category.findFirst({
    where: { OR: [{ name: data.name }, { slug: data.slug }] },
  });

  if (existing)
    throw new AppError("Category with this name or slug already exists", 409);

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
