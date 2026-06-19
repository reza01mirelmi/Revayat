import { Router } from "express";
import { register, login, refresh, logout, getMe } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { protect } from "../../middlewares/auth.middleware";
import { registerSchema, loginSchema } from "../user/user.validation";
import { authLimiter } from "../../middlewares/rateLimit.middleware";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh", authLimiter, refresh);

router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;
