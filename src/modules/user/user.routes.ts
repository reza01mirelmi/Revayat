import { Router } from "express";
import { getUserProfile } from "./user.controller";
import { validate } from "../../middlewares/validate.middleware";
import { updateProfileSchema, changePasswordSchema } from "./user.validation";

const router = Router();

router.get("/:username", getUserProfile);
router.get("/:username/posts", getUserProfile);

export default router;
