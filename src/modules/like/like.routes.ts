import { Router } from "express";
import { toggleLike, getPostLikes, getMyLikes } from "./like.controller";
import { protect } from "../../middlewares/auth.middleware";
import { validateParamId } from "../../middlewares/validateId.middleware";

const router = Router();

router.get("/me/likes", protect, getMyLikes);

router.get("/:postId/likes", validateParamId("postId"), getPostLikes);
router.post("/:postId/like", protect, validateParamId("postId"), toggleLike);

export default router;