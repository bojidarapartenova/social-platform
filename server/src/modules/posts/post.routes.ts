import { Router } from "express";
import { createPost, getPost, getFeed, deletePost } from "./post.controller";
import { requireAuth } from "../../common/middleware/auth.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { createPostSchema } from "./post.validation";

const router = Router();

router.get("/feed", requireAuth, getFeed);
router.post("/", requireAuth, validate(createPostSchema), createPost);
router.get("/:id", getPost);
router.delete("/:id", requireAuth, deletePost);

export default router;