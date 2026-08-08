import { Router } from "express";
import { search } from "./search.controller";
import { requireAuth } from "../../common/middleware/auth.middleware";

const router = Router();
router.get("/", requireAuth, search);
export default router;