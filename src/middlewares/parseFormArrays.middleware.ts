import { Request, Response, NextFunction } from "express";

export function parseFormArrays(fields: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    for (const field of fields) {
      const value = req.body[field];
      if (typeof value !== "string") continue;
      try {
        const parsed = JSON.parse(value);
        req.body[field] = Array.isArray(parsed) ? parsed : [value];
      } catch {
        req.body[field] = [value];
      }
    }
    next();
  };
}