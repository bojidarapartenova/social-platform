import { Router } from "express";
import { follow } from "./follow.controller";
import { requireAuth } from "../../common/middleware/auth.middleware";

const router = Router();

router.post("/:followingId", requireAuth, follow);

export default router;