import { Router } from "express";
import { follow, unfollow, listFollowers, listFollowing, listFriends } from "./follow.controller";
import { requireAuth } from "../../common/middleware/auth.middleware";

const router = Router();

router.get("/friends", requireAuth, listFriends);
router.post("/:followingId", requireAuth, follow);
router.delete("/:followingId", requireAuth, unfollow);
router.get("/:id/followers", requireAuth, listFollowers);
router.get("/:id/following", requireAuth, listFollowing);

export default router;