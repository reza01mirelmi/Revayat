import { Router } from "express";
import {
  getAllTags,
  getTagBySlug,
  createTag,
  updateTag,
  deleteTag,
} from "./tag.controller";
import { validate } from "../../middlewares/validate.middleware";
import { createTagSchema, updateTagSchema } from "./tag.validation";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
import { validateId } from "../../middlewares/validateId.middleware";

const router = Router();

// ===== Admin Routes =====
router.post(
  "/admin/tags",
  protect,
  restrictTo("ADMIN"),
  validate(createTagSchema),
  createTag,
);
router.patch(
  "/admin/tags/:id",
  protect,
  restrictTo("ADMIN"),
  validateId,
  validate(updateTagSchema),
  updateTag,
);
router.delete(
  "/admin/tags/:id",
  protect,
  restrictTo("ADMIN"),
  validateId,
  deleteTag,
);

// ===== Public Routes =====
router.get("/", getAllTags);
router.get("/:slug", getTagBySlug);

export default router;
