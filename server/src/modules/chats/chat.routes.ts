import { Router } from "express";
import { startConversation, getConversations, getMessages, sendMessage, getUnreadCount } from "./chat.controller";
import { requireAuth } from "../../common/middleware/auth.middleware";

const router = Router();

router.get("/", requireAuth, getConversations);
router.post("/with/:userId", requireAuth, startConversation);
router.get("/:conversationId/messages", requireAuth, getMessages);
router.post("/:conversationId/messages", requireAuth, sendMessage);
router.get("/unread-count", requireAuth, getUnreadCount);

export default router;