import { AppError } from "../../errors/AppError";
import { prisma } from "./../../config/db";
import {
  CreatePostInput,
  UpdatePostInput,
  UpdatePostStatusInput,
} from "./post.validation";
import { PostStatus } from "../../generated/prisma";

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
    select: {
      id: true,
      title: true,
      content: true,
      status: true,
      viewsCount: true,
      createdAt: true,
      category: { select: { id: true, name: true, slug: true } },
      tags: { select: { id: true, name: true, slug: true } },
      author: { select: { id: true, username: true, avatarUrl: true } },
    },
  });

  return post;
};

/**
 * Get all posts created by the authenticated user.
 */
export const getMyPostsService = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const [total, posts] = await prisma.$transaction([
    prisma.post.count({ where: { userId } }),
    prisma.post.findMany({
      where: { userId },
      skip,
      take: limit,
      omit: {
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    posts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Update an existing post owned by the authenticated user.
 */
export const updatePostService = async (
  userId: string,
  id: string,
  data: UpdatePostInput,
) => {
  const post = await prisma.post.findUnique({
    where: { id, userId },
  });

  if (!post) throw new AppError("Post not found", 404);

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) throw new AppError("Category not found", 404);
  }

  if (data.tags?.length) {
    const tags = await prisma.tag.findMany({
      where: { id: { in: data.tags } },
    });

    if (tags.length !== data.tags.length) {
      throw new AppError("One or more tags not found", 404);
    }
  }

  const updatedPost = await prisma.post.update({
    where: { id, userId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      ...(data.tags !== undefined && {
        tags: data.tags
          ? {
              set: data.tags.map((id) => ({ id })),
            }
          : undefined,
      }),
    },
    select: {
      id: true,
      title: true,
      content: true,
      status: true,
      viewsCount: true,
      createdAt: true,
      category: { select: { id: true, name: true, slug: true } },
      tags: { select: { id: true, name: true, slug: true } },
    },
  });

  return updatedPost;
};

/**
 * Delete a post owned by the authenticated user.
 */
export const deletePostService = async (userId: string, id: string) => {
  const post = await prisma.post.findUnique({
    where: { id, userId },
  });

  if (!post) throw new AppError("Post not found", 404);

  await prisma.post.delete({ where: { id, userId } });
};

/**
 * Get paginated list of published posts (public).
 */
export const getAllPostsService = async (
  page: number,
  limit: number,
  search?: string,
) => {
  const where = {
    status: PostStatus.PUBLISHED,
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { content: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
  const skip = (page - 1) * limit;

  const [total, posts] = await prisma.$transaction([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        content: true,
        viewsCount: true,
        createdAt: true,
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, username: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    posts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get a single post by its ID.
 */
export const getPostByIdService = async (id: string) => {
  const post = await prisma.post.findFirst({
    where: { id, status: PostStatus.PUBLISHED },
    select: {
      id: true,
      title: true,
      content: true,
      viewsCount: true,
      createdAt: true,
      category: { select: { id: true, name: true, slug: true } },
      tags: { select: { id: true, name: true, slug: true } },
      author: { select: { id: true, username: true, avatarUrl: true } },
    },
  });

  if (!post) throw new AppError("Post not found", 404);

  await prisma.post.update({
    where: { id },
    data: { viewsCount: { increment: 1 } },
  });

  return {
    ...post,
    viewsCount: post.viewsCount + 1,
  };
};

/**
 * Get posts by category or tag slug with pagination and search.
 * @param filter - categorySlug or tagSlug
 * @param page - current page number
 * @param limit - number of posts per page
 * @param search - optional search term for title and content
 */
export const getPostsByFilterService = async (
  filter: { categorySlug?: string; tagSlug?: string },
  page: number,
  limit: number,
  search?: string,
) => {
  const where = {
    status: PostStatus.PUBLISHED,
    ...(filter.categorySlug && { category: { slug: filter.categorySlug } }),
    ...(filter.tagSlug && { tags: { some: { slug: filter.tagSlug } } }),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { content: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const skip = (page - 1) * limit;

  const [total, posts] = await prisma.$transaction([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        content: true,
        viewsCount: true,
        createdAt: true,
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, username: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    posts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
