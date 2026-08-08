import { Request, Response, NextFunction } from "express";

export function parseFormArrays(fields: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    for (const field of fields) {
      if (typeof req.body[field] === "string") {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch {}
      }
    }
    next();
  };
}
