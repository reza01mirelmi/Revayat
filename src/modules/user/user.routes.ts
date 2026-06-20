import { Router } from "express";
import {
  getUserProfile,
  getUserPosts,
  updateMe,
  changePassword,
  deleteMe,
} from "./user.controller";
import { validate } from "../../middlewares/validate.middleware";
import { updateProfileSchema, changePasswordSchema } from "./user.validation";
import { protect } from "./../../middlewares/auth.middleware";
const router = Router();

// Public Routes
router.get("/:username", getUserProfile);
router.get("/:username/posts", getUserPosts);

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

export default router;
