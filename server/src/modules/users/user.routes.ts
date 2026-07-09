import { Router } from "express";
import { getUser, updateUser } from "./user.controller";
import { requireAuth } from "../../common/middleware/auth.middleware";

const router = Router();

router.get("/:id", getUser);
router.put("/:id", requireAuth, updateUser);

export default router;