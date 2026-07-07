import { AppError } from "../../errors/AppError";
import { prisma } from "./../../config/db";
import { CreateCommentInput, UpdateCommentInput } from "./comment.validation";
import { PostStatus } from "../../generated/prisma";

/**
 * Create a new comment on a post (authenticated users only).
 */
export const createCommentService = async (
  postId: string,
  userId: string,
  data: CreateCommentInput,
) => {
  const post = await prisma.post.findUnique({
    where: { id: postId, status: PostStatus.PUBLISHED },
  });

  if (!post) throw new AppError("Post not found", 404);

  const comment = await prisma.comment.create({
    data: {
      content: data.content,
      postId,
      userId,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });

  return comment;
};

/**
 * Update an existing comment by the comment owner
 */
export const updateCommentService = async (
  postId: string,
  commentId: string,
  userId: string,
  data: UpdateCommentInput,
) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId, postId, userId },
  });

  if (!comment) throw new AppError("Comment not found", 404);

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: {
      ...(data.content !== undefined && { content: data.content }),
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: {
        select: { id: true, username: true, avatarUrl: true },
      },
    },
  });

  return updatedComment;
};

/**
 * Delete a comment.
 * If userId is provided, only deletes if owned by that user.
 * postId is optional (user routes include it; admin route doesn't).
 * If userId is omitted, deletes regardless of owner (admin use).
 */
export const deleteCommentService = async (
  commentId: string,
  postId?: string,
  userId?: string,
) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
      ...(postId && { postId }),
      ...(userId && { userId }),
    },
  });

  if (!comment) throw new AppError("Comment not found", 404);

  await prisma.comment.delete({ where: { id: commentId } });
};

/**
 * Get all comments for a specific post (public)
 */
export const getAllCommentsService = async (
  postId: string,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  const post = await prisma.post.findUnique({
    where: { id: postId, status: PostStatus.PUBLISHED },
    select: {
      comments: {
        skip,
        take: limit,
        select: {
          id: true,
          content: true,
          createdAt: true,

          user: { select: { id: true, username: true, avatarUrl: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  if (!post) throw new AppError("Post not found", 404);

  const total = post._count.comments;

  return {
    comments: post.comments,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
