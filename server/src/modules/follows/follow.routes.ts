import { Router } from "express";
import { follow, unfollow } from "./follow.controller";
import { requireAuth } from "../../common/middleware/auth.middleware";

const router = Router();

router.post("/:followingId", requireAuth, follow);
router.delete("/:followingId", requireAuth, unfollow);

export default router;