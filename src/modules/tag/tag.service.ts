import { AppError } from "../../errors/AppError";
import { PostStatus } from "../../generated/prisma";
import { prisma } from "./../../config/db";
import { CreateTagInput, UpdateTagInput } from "./tag.validation";

/**
 * Get all tags (public).
 */
export const getAllTagsService = async () => {
  const tags = await prisma.tag.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return tags;
};

/**
 * Get a single tag by its slug (public).
 */
export const getTagBySlugService = async (
  slug: string,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const tag = await prisma.tag.findUnique({
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

  if (!tag) throw new AppError("Tag not found", 404);

  const total = tag._count.posts;

  return {
    tag: {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      posts: tag.posts,
    },
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Create a new tag (Admin only).
 */
export const createTagService = async (data: CreateTagInput) => {
  const existing = await prisma.tag.findFirst({
    where: { OR: [{ name: data.name }, { slug: data.slug }] },
  });

  if (existing)
    throw new AppError("Tag with this name or slug already exists", 409);
  
  const tag = await prisma.tag.create({
    data,
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return tag;
};

/**
 * Update an existing tag by ID (Admin only).
 */
export const updateTagService = async (tagId: string, data: UpdateTagInput) => {
  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
  });

  if (!tag) throw new AppError("Tag not found", 404);

  const updatedTag = await prisma.tag.update({
    where: { id: tagId },
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

  return updatedTag;
};

/**
 * Delete a tag by ID (Admin only).
 */
export const deleteTagService = async (tagId: string) => {
  const tag = await prisma.tag.findUnique({
    where: { id: tagId },
  });

  if (!tag) throw new AppError("Tag not found", 404);

  await prisma.tag.delete({ where: { id: tagId } });
};
