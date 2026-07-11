import { Router } from "express";
import { deleteComment } from "./comment.controller";
import { requireAuth } from "../../common/middleware/auth.middleware";

const router = Router();
router.delete("/:id", requireAuth, deleteComment);

export default router;