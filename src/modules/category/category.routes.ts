import { Router } from "express";
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./category.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
import { validateId } from "../../middlewares/validateId.middleware";

const router = Router();

// ===== Admin Routes =====
router.post(
  "/admin/categories",
  protect,
  restrictTo("ADMIN"),
  validate(createCategorySchema),
  createCategory,
);
router.patch(
  "/admin/categories/:id",
  protect,
  restrictTo("ADMIN"),
  validateId,
  validate(updateCategorySchema),
  updateCategory,
);
router.delete(
  "/admin/categories/:id",
  protect,
  restrictTo("ADMIN"),
  validateId,
  deleteCategory,
);

// ===== Public Routes =====
router.get("/", getAllCategories);
router.get("/:slug", getCategoryBySlug);

export default router;
