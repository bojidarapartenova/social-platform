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

export async function getFavorites(req: Request, res: Response) {
    try {
        const favorites = await bookmarkService.getFavorites(req.user!.userId);
        res.status(200).json(favorites);
    }
    catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}