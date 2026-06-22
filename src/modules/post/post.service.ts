import { AppError } from "../../errors/AppError";
import { prisma } from "./../../config/db";
import {
  CreatePostInput,
  UpdatePostInput,
  UpdatePostStatusInput,
} from "./post.validation";

/**
 * Create a new post.
 */
export const createPostService = async (
  userId: string,
  data: CreatePostInput,
) => {
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  if (data.tags?.length) {
    const tags = await prisma.tag.findMany({
      where: { id: { in: data.tags } },
    });

    if (tags.length !== data.tags.length) {
      throw new AppError("One or more tags not found", 404);
    }
  }

  const post = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      categoryId: data.categoryId,
      userId,
      tags: data.tags
        ? {
            connect: data.tags.map((id) => ({ id })),
          }
        : undefined,
    },
    include: {
      tags: true,
      category: true,
    },
  });

  return post;
};
