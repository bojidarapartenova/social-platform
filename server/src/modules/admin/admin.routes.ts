import { Router } from "express";
import {
    getStats, getUsers, setUserRole, deleteUser,
    getPosts, deletePost, getGroups, deleteGroup,
} from "./admin.controller";
import { requireAuth, requireAdmin } from "../../common/middleware/auth.middleware";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.put("/users/:id/role", setUserRole);
router.delete("/users/:id", deleteUser);
router.get("/posts", getPosts);
router.delete("/posts/:id", deletePost);
router.get("/groups", getGroups);
router.delete("/groups/:id", deleteGroup);

export default router;