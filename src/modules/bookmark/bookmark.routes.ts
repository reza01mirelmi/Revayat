import { Router } from "express";
import { getMyBookmarks, toggleBookmark } from "./bookmark.controller";
import { protect } from "../../middlewares/auth.middleware";
import { validateParamId } from "../../middlewares/validateId.middleware";

const router = Router();

router.get("/me/bookmarks", protect, getMyBookmarks);

router.post(
  "/:postId/bookmark",
  protect,
  validateParamId("postId"),
  toggleBookmark,
);

export default router;
