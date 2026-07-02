import { Router } from "express";
import {
  createPost,
  getMyPosts,
  updatePost,
  deletePost,
  getAllPosts,
  getPostById,
  getPostsByCategory,
  getPostsByTag,
  getRelatedPosts,
  getAllPostsAdmin,
  deletePostAdmin,
  updatePostStatus,
} from "./post.controller";

import { validate } from "../../middlewares/validate.middleware";
import {
  createPostSchema,
  updatePostSchema,
  updatePostStatusSchema,
} from "./post.validation";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
import { validateId } from "../../middlewares/validateId.middleware";

const router = Router();

// ===== User Routes (Login required) =====
router.post("/", protect, validate(createPostSchema), createPost);
router.get("/me", protect, getMyPosts);
router.patch(
  "/me/:id",
  protect,
  validateId,
  validate(updatePostSchema),
  updatePost,
);
router.delete("/me/:id", protect, validateId, deletePost);

// ===== Admin Routes =====
router.get("/admin/posts", protect, restrictTo("ADMIN"), getAllPostsAdmin);
router.delete(
  "/admin/posts/:id",
  protect,
  restrictTo("ADMIN"),
  validateId,
  deletePostAdmin,
);
router.patch(
  "/admin/posts/:id/status",
  protect,
  restrictTo("ADMIN"),
  validateId,
  validate(updatePostStatusSchema),
  updatePostStatus,
);

// ===== Public Routes =====
router.get("/", getAllPosts);
router.get("/category/:categorySlug", getPostsByCategory);
router.get("/tag/:tagSlug", getPostsByTag);
router.get("/:id/related", validateId, getRelatedPosts);
router.get("/:id", validateId, getPostById);

export default router;
