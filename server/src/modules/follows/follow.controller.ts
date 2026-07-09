import { Request, Response } from "express";
import { followUser } from "./follow.service";

export async function follow(req: Request<{ followingId: string }>, res: Response) {
    try {
        const followerId = req.user!.userId;
        const { followingId } = req.params;
        await followUser(followerId, followingId);
        res.status(200).json({ message: "Followed" });
    }
    catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}