import { Router } from "express";
import {
  createComment,
  updateComment,
  deleteComment,
  getAllComments,
  deleteCommentAdmin,
} from "./comment.controller";
import { validate } from "../../middlewares/validate.middleware";
import { createCommentSchema, updateCommentSchema } from "./comment.validation";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
import { validateParamId } from "../../middlewares/validateId.middleware";

const router = Router();

// ===== Admin Routes =====
router.delete(
  "/admin/comments/:id",
  protect,
  restrictTo("ADMIN"),
  validateParamId("id"),
  deleteCommentAdmin,
);

// ===== User Routes =====
router.post(
  "/:postId/comments",
  protect,
  validateParamId("postId"),
  validate(createCommentSchema),
  createComment,
);
router.patch(
  "/:postId/comments/:id",
  protect,
  validateParamId("postId"),
  validateParamId("id"),
  validate(updateCommentSchema),
  updateComment,
);
router.delete(
  "/:postId/comments/:id",
  protect,
  validateParamId("postId"),
  validateParamId("id"),
  deleteComment,
);


// ===== Public Routes =====
router.get("/:postId/comments", validateParamId("postId"), getAllComments);

export default router;
