import { Router } from "express";
import { getUser, updateUser } from "./user.controller";
import { requireAuth, optionalAuth } from "../../common/middleware/auth.middleware";
import { getUserPosts } from "../posts/post.controller";

const router = Router();

router.get("/:id", optionalAuth, getUser);
router.put("/:id", requireAuth, updateUser);
router.get("/:id/posts", requireAuth, getUserPosts);

export default router;