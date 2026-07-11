import { Request, Response } from "express";
import { LikeService } from "./like.service";

const likeService = new LikeService();

export async function toggleLike(req: Request<{ postId: string }>, res: Response) {
    try {
        const userId = req.user!.userId;
        const result = await likeService.toggleLike(req.params.postId, userId);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}