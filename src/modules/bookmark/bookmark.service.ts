import { AppError } from "../../errors/AppError";
import { prisma } from "./../../config/db";
import { PostStatus } from "../../generated/prisma";

/**
 * Toggle bookmark on a post (bookmark if not bookmarked, remove if already bookmarked)
 */
export const toggleBookmarkService = async (postId: string, userId: string) => {
  const post = await prisma.post.findUnique({
    where: { id: postId, status: PostStatus.PUBLISHED },
  });

  if (!post) throw new AppError("Post not found", 404);

  const existingBookmark = await prisma.bookmark.findUnique({
    where: { postId_userId: { postId, userId } },
  });

  if (existingBookmark) {
    await prisma.bookmark.delete({ where: { id: existingBookmark.id } });
    return { bookmarked: false };
  }

  await prisma.bookmark.create({ data: { postId, userId } });
  return { bookmarked: true };
};

/**
 * Get all posts bookmarked by the authenticated user
 */
export const getMyBookmarksService = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      bookmarks: {
        skip,
        take: limit,
        select: {
          id: true,
          createdAt: true,
          post: {
            select: {
              id: true,
              title: true,
              viewsCount: true,
              createdAt: true,
              author: { select: { id: true, username: true, avatarUrl: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { bookmarks: true } },
    },
  });

  if (!user) throw new AppError("User not found", 404);

  const total = user._count.bookmarks;

  return {
    bookmarks: user.bookmarks,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
