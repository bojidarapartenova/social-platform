import { Router } from "express";
import { createPost, getPost, getFeed, updatePost, deletePost } from "./post.controller";
import { toggleLike } from "./like.controller";
import { addComment, getComments } from "./comment.controller";
import { requireAuth } from "../../common/middleware/auth.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { createPostSchema, updatePostSchema } from "./post.validation";
import { toggleFavorite, getFavorites } from "./bookmark.controller";
import { getGroupPosts } from "./post.controller";
import { getPostsByTag } from "./post.controller";
import { optionalAuth } from "../../common/middleware/auth.middleware";
import { getPopularPosts } from "./post.controller";
import { getSuggestedPosts } from "./post.controller";

const router = Router();

router.get("/feed", requireAuth, getFeed);
router.get("/favorites", requireAuth, getFavorites);
router.post("/", requireAuth, validate(createPostSchema), createPost);
router.get("/group/:groupId", requireAuth, getGroupPosts);
router.get("/tag/:tag", optionalAuth, getPostsByTag);
router.get("/popular", optionalAuth, getPopularPosts);
router.get("/suggested", requireAuth, getSuggestedPosts);
router.get("/:id", optionalAuth, getPost);
router.put("/:id", requireAuth, validate(updatePostSchema), updatePost);
router.delete("/:id", requireAuth, deletePost);

router.post("/:postId/likes", requireAuth, toggleLike);
router.post("/:postId/comments", requireAuth, addComment);
router.get("/:postId/comments", getComments);
router.post("/:postId/favorites", requireAuth, toggleFavorite);

export default router;