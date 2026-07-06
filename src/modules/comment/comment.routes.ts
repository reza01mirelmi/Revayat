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

// ===== User Routes =====
router.post(
  "/:postId",
  protect,
  validateParamId("postId"),
  validate(createCommentSchema),
  createComment,
);
router.patch(
  "/:postId/:id",
  protect,
  validateParamId("postId"),
  validateParamId("id"),
  validate(updateCommentSchema),
  updateComment,
);
router.delete(
  "/:postId/:id",
  protect,
  validateParamId("postId"),
  validateParamId("id"),
  deleteComment,
);

// ===== Admin Routes =====
router.delete(
  "/admin/:id",
  protect,
  restrictTo("ADMIN"),
  validateParamId("id"),
  deleteCommentAdmin,
);

// ===== Public Routes =====
router.get("/:postId", validateParamId("postId"), getAllComments);

export default router;
