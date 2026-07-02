import { Router } from "express";
import {
  getUserProfile,
  getUserPosts,
  updateMe,
  changePassword,
  deleteMe,
  getAllUsers,
  getUserById,
  updateUserRole,
  banUser,
  unbanUser,
  deleteUser,
} from "./user.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  updateProfileSchema,
  changePasswordSchema,
  updateRoleSchema,
} from "./user.validation";
import { protect, restrictTo } from "./../../middlewares/auth.middleware";
import { validateId } from "../../middlewares/validateId.middleware";
const router = Router();

// User Routes (Login required)
router.patch("/me", protect, validate(updateProfileSchema), updateMe);
router.patch(
  "/me/password",
  protect,
  validate(changePasswordSchema),
  changePassword,
);
router.delete("/me", protect, deleteMe);

// Admin Routes
router.get("/admin/users", protect, restrictTo("ADMIN"), getAllUsers);

router.get(
  "/admin/users/:id",
  protect,
  restrictTo("ADMIN"),
  validateId,
  getUserById,
);

router.patch(
  "/admin/users/:id/role",
  protect,
  validate(updateRoleSchema),
  restrictTo("ADMIN"),
  validateId,
  updateUserRole,
);

router.patch(
  "/admin/users/:id/ban",
  protect,
  restrictTo("ADMIN"),
  validateId,
  banUser,
);

router.patch(
  "/admin/users/:id/unban",
  protect,
  restrictTo("ADMIN"),
  validateId,
  unbanUser,
);

router.delete(
  "/admin/users/:id",
  protect,
  restrictTo("ADMIN"),
  validateId,
  deleteUser,
);

// Public Routes
router.get("/:username", getUserProfile);
router.get("/:username/posts", getUserPosts);

export default router;
