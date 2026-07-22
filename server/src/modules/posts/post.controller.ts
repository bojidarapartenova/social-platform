import { Request, Response } from "express";
import { PostService } from "./post.service";
import { Like } from "./like.model";
import { Comment } from "./comment.model";
import { Bookmark } from "./bookmark.model";
import { Follow } from "../follows/follow.model";

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

async function decoratePosts(posts: any[], userId?: string) {
    return Promise.all(
        posts.map(async (post) => {
            const [likeCount, commentCount, favoriteCount, likedByMe, favoritedByMe] = await Promise.all([
                Like.countDocuments({ postId: post._id }),
                Comment.countDocuments({ postId: post._id }),
                Bookmark.countDocuments({ postId: post._id }),
                userId ? Like.exists({ postId: post._id, userId }) : false,
                userId ? Bookmark.exists({ postId: post._id, userId }) : false,
            ]);
            return { ...post.toObject(), likeCount, commentCount, favoriteCount, likedByMe: !!likedByMe, favoritedByMe: !!favoritedByMe };
        })
    );
}

export async function getFeed(req: Request, res: Response) {
    try {
        const userId = req.user!.userId;
        const scope = req.query.scope === "following" ? "following" : "all";

        let posts;
        if (scope === "following") {
            const following = await Follow.find({ followerId: userId }).select("followingId");
            const followingIds = following.map((f) => f.followingId.toString());
            posts = await postService.getFollowingFeed(userId, followingIds);

        } else {
            posts = await postService.getFeed();
        }

        const decorated = await decoratePosts(posts, userId);
        res.status(200).json(decorated);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function getUserPosts(req: Request<{ id: string }>, res: Response) {
    try {
        const posts = await postService.getPostsByAuthor(req.params.id);
        const decorated = await decoratePosts(posts, req.user?.userId);
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