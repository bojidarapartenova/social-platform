import { Request, Response } from "express";
import { SearchService } from "./search.service";
import { decoratePosts } from "../posts/post.controller";

const searchService = new SearchService();

export async function search(req: Request, res: Response) {
    try {
        const q = ((req.query.q as string) || "").trim();
        if (!q) return res.status(200).json({ users: [], groups: [], posts: [] });

        const { users, groups, posts } = await searchService.search(q, req.user?.userId);
        const decoratedPosts = await decoratePosts(posts, req.user?.userId);

        res.status(200).json({ users, groups, posts: decoratedPosts });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}