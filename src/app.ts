import express, { Request, Response, NextFunction } from "express";
import routes from "./routes";
import errorHandler from "./middlewares/error.middleware";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Security
app.use(helmet());
app.use(cors());

 // Parse cookies
app.use(cookieParser());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static("uploads"));

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api", routes);

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Can't find ${req.originalUrl}`) as any;
  err.statusCode = 404;
  next(err);
});

// Error Handling
app.use(errorHandler);

export default app;
