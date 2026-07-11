import { Request, Response } from "express";
import { PostService } from "./post.service";
import { Follow } from "../follows/follow.model";
import { Like } from "./like.model";
import { Comment } from "./comment.model";

const postService = new PostService();

export async function createPost(req: Request, res: Response) {
    try {
        const authorId = req.user!.userId;
        const { type, caption, media, groupId } = req.body;
        const post = await postService.createPost(authorId, { type, caption, media, groupId });
        res.status(201).json(post);
    }
    catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function getPost(req: Request<{ id: string }>, res: Response) {
    try {
        const post = await postService.getPostById(req.params.id);
        res.status(200).json(post);
    }
    catch (error: any) {
        res.status(404).json({ message: error.message });
    }
}

export async function getFeed(req: Request, res: Response) {
    try {
        const userId = req.user!.userId;
        const following = await Follow.find({ followerId: userId }).select("followingId");
        const followingIds = following.map((f) => f.followingId.toString());
        const posts = await postService.getFeed(userId, followingIds);

        const decorated = await Promise.all(
            posts.map(async (post) => {
                const [likeCount, commentCount, likedByMe] = await Promise.all([
                    Like.countDocuments({ postId: post._id }),
                    Comment.countDocuments({ postId: post._id }),
                    Like.exists({ postId: post._id, userId }),
                ]);
                return { ...post.toObject(), likeCount, commentCount, likedByMe: !!likedByMe };
            })
        );

        res.status(200).json(decorated);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function deletePost(req: Request<{ id: string }>, res: Response) {
    try {
        await postService.deletePost(req.params.id, req.user!.userId);
        res.status(200).json({ message: "Post deleted" });
    }
    catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function updatePost(req: Request<{ id: string }>, res: Response) {
    try {
        const post = await postService.updatePost(req.params.id, req.user!.userId, req.body);
        res.status(200).json(post);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}