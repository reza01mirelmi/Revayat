import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AppError } from "../errors/AppError";

export const validateId = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const result = z.string().uuid().safeParse(req.params.id);

  if (!result.success) {
    return next(new AppError("Invalid ID format", 400));
  }

  next();
};
