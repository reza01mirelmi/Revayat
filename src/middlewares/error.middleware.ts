import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";
import { AppError } from "../errors/AppError";

export const errorHandler = (
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof MulterError) {
    console.error(err);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof AppError) {
    console.error(err);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
};

export default errorHandler;
