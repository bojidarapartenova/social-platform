import { Router } from "express";
import {
    createGroup, getGroup, updateGroup, getMyGroups, requestToJoin,
    getPendingRequests, getMembers, approveRequest, rejectRequest, kickMember, leaveGroup
} from "./group.controller";
import { requireAuth, optionalAuth } from "../../common/middleware/auth.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { createGroupSchema, updateGroupSchema } from "./group.validation";

const router = Router();

router.get("/mine", requireAuth, getMyGroups);
router.post("/", requireAuth, validate(createGroupSchema), createGroup);
router.get("/:id", optionalAuth, getGroup);
router.put("/:id", requireAuth, validate(updateGroupSchema), updateGroup);
router.post("/:id/join", requireAuth, requestToJoin);
router.get("/:id/requests", requireAuth, getPendingRequests);
router.get("/:id/members", requireAuth, getMembers);
router.post("/:id/requests/:userId/approve", requireAuth, approveRequest);
router.post("/:id/requests/:userId/reject", requireAuth, rejectRequest);
router.delete("/:id/members/:userId", requireAuth, kickMember);
router.post("/:id/leave", requireAuth, leaveGroup);

export default router;