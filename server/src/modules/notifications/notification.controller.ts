import { Request, Response } from "express";
import { NotificationService } from "./notification.service";

const notificationService = new NotificationService();

export async function getNotifications(req: Request, res: Response) {
    try {
        const notifications = await notificationService.getForUser(req.user!.userId);
        res.status(200).json(notifications);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function getUnreadCount(req: Request, res: Response) {
    try {
        const count = await notificationService.getUnreadCount(req.user!.userId);
        res.status(200).json({ count });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function markAllRead(req: Request, res: Response) {
    try {
        await notificationService.markAllRead(req.user!.userId);
        res.status(200).json({ message: "Marked all as read" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function markOneRead(req: Request<{ id: string }>, res: Response) {
    try {
        await notificationService.markOneRead(req.params.id, req.user!.userId);
        res.status(200).json({ message: "Marked as read" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}