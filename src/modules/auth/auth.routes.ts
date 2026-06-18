import { Router } from "express";
import { register, login, refresh, logout, getMe } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { protect } from "../../middlewares/auth.middleware";
import { registerSchema, loginSchema } from "../user/user.validation";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refresh);

router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;
