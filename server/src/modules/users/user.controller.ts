import { Request, Response } from "express";
import { UserService } from "./user.service";

const userService = new UserService();

export async function getUser(req: Request<{ id: string }>, res: Response) {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
}

export async function updateUser(req: Request<{ id: string }>, res: Response) {
    try {
        if (req.user!.userId !== req.params.id) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const { name, bio, avatarUrl } = req.body;
        const user = await userService.updateUser(req.params.id, { name, bio, avatarUrl });
        res.status(200).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}