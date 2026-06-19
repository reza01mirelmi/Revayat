import { AppError } from "../../errors/AppError";
import { prisma } from "./../../config/db";
import { updateProfileSchema, changePasswordSchema } from "./user.validation";

export const getUserProfileService = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: { username: true, bio: true, avatarUrl: true, createdAt: true },
  });

  if (!user) throw new AppError("User not found", 404);

  return user;
};

export const getUserPostsService = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
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

  if (!user) throw new AppError("User not found", 404);

  return user.posts;
};
