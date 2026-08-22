import { Request, Response } from "express";
import { AdminService } from "./admin.service";

const adminService = new AdminService();

export async function getStats(req: Request, res: Response) {
    try {
        const stats = await adminService.getStats();
        res.status(200).json(stats);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function getUsers(req: Request, res: Response) {
    try {
        const search = (req.query.search as string) || "";
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const users = await adminService.getUsers(search, page, limit);
        res.status(200).json(users);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function setUserRole(req: Request<{ id: string }>, res: Response) {
    try {
        const { role } = req.body;

        const user = adminService.setUserRole(req.params.id, req.user!.userId, role);
        res.status(200).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function deleteUser(req: Request<{ id: string }>, res: Response) {
    try {
        await adminService.deleteUser(req.params.id, req.user!.userId);
        res.status(200).json({ message: "User deleted" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function getPosts(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = await parseInt(req.query.limit as string) || 20;

        const posts = await adminService.getPosts(page, limit);
        res.status(200).json(posts);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function deletePost(req: Request<{ id: string }>, res: Response) {
    try {
        await adminService.deletePost(req.params.id);
        res.status(200).json({ message: "Post deleted" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function getGroups(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = await parseInt(req.query.limit as string) || 20;

        const posts = await adminService.getGroups(page, limit);
        res.status(200).json(posts);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function deleteGroup(req: Request<{ id: string }>, res: Response) {
    try {
        await adminService.deleteGroup(req.params.id);
        res.status(200).json({ message: "Group deleted" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}