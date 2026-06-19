import { Request, Response, NextFunction } from "express";

import { getUserPostsService, getUserProfileService } from "./user.service";

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username } = req.params as { username: string };

    const user = await getUserProfileService(username);

    res.status(200).json({ status: "success", data: { user } });
  } catch (error) {
    next(error);
  }
};
export const getUserPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username } = req.params as { username: string };

    const posts  = await getUserPostsService(username);

    res.status(200).json({ status: "success", data: { posts  } });
  } catch (error) {
    next(error);
  }
};
