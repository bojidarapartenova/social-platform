import { Router } from "express";
import { createReport, getReports, dismissReport, resolveReport } from "./report.controller";
import { requireAuth, requireAdmin } from "../../common/middleware/auth.middleware";

const router = Router();

router.post("/", requireAuth, createReport);
router.get("/", requireAuth, requireAdmin, getReports);
router.post("/:id/dismiss", requireAuth, requireAdmin, dismissReport);
router.post("/:id/resolve", requireAuth, requireAdmin, resolveReport);

export default router;