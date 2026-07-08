import { AppError } from "../../errors/AppError";
import { prisma } from "./../../config/db";
import { PostStatus } from "../../generated/prisma";

/**
 * Toggle like on a post (like if not liked, unlike if already liked)
 */
export const toggleLikeService = async (postId: string, userId: string) => {
  const post = await prisma.post.findUnique({
    where: { id: postId, status: PostStatus.PUBLISHED },
  });

  if (!post) throw new AppError("Post not found", 404);

  const existingLike = await prisma.like.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } });
    return { liked: false };
  }

  await prisma.like.create({ data: { postId, userId } });
  return { liked: true };
};

/**
 * Get all users who liked a specific post (public)
 */
export const getPostLikesService = async (
  postId: string,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const post = await prisma.post.findUnique({
    where: { id: postId, status: PostStatus.PUBLISHED },
    select: {
      likes: {
        skip,
        take: limit,
        select: {
          id: true,
          createdAt: true,
          user: {
            select: { id: true, username: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { likes: true } },
    },
  });

  if (!post) throw new AppError("Post not found", 404);

  const total = post._count.likes;

  return {
    likes: post.likes,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
