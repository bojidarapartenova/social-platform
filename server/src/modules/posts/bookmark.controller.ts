import { Request, Response } from "express";
import { BookmarkService } from "./bookmark.service";

const bookmarkService = new BookmarkService();

export async function toggleFavorite(req: Request<{ postId: string }>, res: Response) {
    try {
        const result = await bookmarkService.toggleFavorite(req.params.postId, req.user!.userId);
        res.status(200).json(result);
    }
    catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}