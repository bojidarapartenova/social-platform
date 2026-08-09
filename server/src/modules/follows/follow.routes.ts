import { Router } from "express";
import { follow, unfollow } from "./follow.controller";
import { requireAuth } from "../../common/middleware/auth.middleware";
import { listFollowers, listFollowing } from "./follow.controller";

const router = Router();

router.post("/:followingId", requireAuth, follow);
router.delete("/:followingId", requireAuth, unfollow);
router.get("/:id/followers", requireAuth, listFollowers);
router.get("/:id/following", requireAuth, listFollowing);

export default router;