import { Router } from "express";
import { getNotifications, getUnreadCount, markAllRead, markOneRead } from "./notification.controller";
import { requireAuth } from "../../common/middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, getNotifications);
router.get("/unread-count", requireAuth, getUnreadCount);
router.post("/read-all", requireAuth, markAllRead);
router.post("/:id/read", requireAuth, markOneRead);

export default router;