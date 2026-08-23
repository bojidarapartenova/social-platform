import { Request, Response } from "express";
import { ReportService } from "./report.service";

const reportService = new ReportService();

export async function createReport(req: Request, res: Response) {
    try {
        const { targetType, targetId, reason, details } = req.body;
        const report = await reportService.createReport(req.user!.userId, targetType, targetId, reason, details);
        res.status(201).json(report);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function getReports(req: Request, res: Response) {
    try {
        const status = (req.query.status as string) || "pending";
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const result = await reportService.getReports(status, page, limit);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function dismissReport(req: Request<{ id: string }>, res: Response) {
    try {
        await reportService.dismissReport(req.params.id);
        res.status(200).json({ message: "Report dismissed" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function resolveReport(req: Request<{ id: string }>, res: Response) {
    try {
        await reportService.resolveReport(req.params.id, req.user!.userId);
        res.status(200).json({ message: "Report resolved" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}