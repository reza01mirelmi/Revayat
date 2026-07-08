import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/user/user.routes";
import postRoutes from "../modules/post/post.routes";
import categoryRoutes from "../modules/category/category.routes";
import tagRoutes from "../modules/tag/tag.routes";
import commentRoutes from "../modules/comment/comment.routes";
import likeRoutes from "../modules/like/like.routes";
import bookmarkRoutes from "../modules/bookmark/bookmark.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/posts", commentRoutes);
router.use("/posts", likeRoutes);
router.use("/posts", bookmarkRoutes);
router.use("/categories", categoryRoutes);
router.use("/tags", tagRoutes);

export default router;
