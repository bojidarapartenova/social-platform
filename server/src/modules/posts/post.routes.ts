import { Router } from "express";
import { createPost, getPost, getFeed, updatePost, deletePost } from "./post.controller";
import { toggleLike } from "./like.controller";
import { addComment, getComments } from "./comment.controller";
import { requireAuth } from "../../common/middleware/auth.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { createPostSchema } from "./post.validation";

const router = Router();

router.get("/feed", requireAuth, getFeed);
router.post("/", requireAuth, validate(createPostSchema), createPost);
router.get("/:id", getPost);
router.put("/:id", requireAuth, updatePost);
router.delete("/:id", requireAuth, deletePost);

router.post("/:postId/likes", requireAuth, toggleLike);
router.post("/:postId/comments", requireAuth, addComment);
router.get("/:postId/comments", getComments);

export default router;