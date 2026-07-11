import { Request, Response } from "express";
import { CommentService } from "./comment.service";

const commentService = new CommentService();

export async function addComment(req: Request<{ postId: string }>, res: Response) {
    try {
        const authorId = req.user!.userId;
        const { text } = req.body;
        const comment = await commentService.addComment(req.params.postId, authorId, text);
        res.status(201).json(comment);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function getComments(req: Request<{ postId: string }>, res: Response) {
    try {
        const comments = await commentService.getComments(req.params.postId);
        res.status(200).json(comments);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function deleteComment(req: Request<{ id: string }>, res: Response) {
    try {
        await commentService.deleteComment(req.params.id, req.user!.userId);
        res.status(200).json({ message: "Comment deleted" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}