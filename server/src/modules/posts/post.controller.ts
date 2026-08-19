import { Request, Response } from "express";
import { PostService } from "./post.service";
import { Like } from "./like.model";
import { Comment } from "./comment.model";
import { Bookmark } from "./bookmark.model";
import { Follow } from "../follows/follow.model";
import { GroupMembership } from "../groups/groupMembership.model";

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
        const [decorated] = await decoratePosts([post], req.user?.userId);
        res.status(200).json(decorated);
    }
    catch (error: any) {
        res.status(404).json({ message: error.message });
    }
}

export async function getPopularPosts(req: Request, res: Response) {
    try {
        const posts = await postService.getPopularPosts();
        const decorated = await decoratePosts(posts, req.user?.userId);
        res.status(200).json(decorated);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function getSuggestedPosts(req: Request, res: Response) {
    try {
        const userId = req.user?.userId?.toString();
        const posts = await postService.getSuggestions(userId);
        res.status(200).json(posts);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function decoratePosts(posts: any[], userId?: string) {
    return Promise.all(
        posts.map(async (post) => {
            const plain = typeof post.toObject === "function" ? post.toObject() : post;
            const [likeCount, commentCount, favoriteCount, likedByMe, favoritedByMe] = await Promise.all([
                Like.countDocuments({ postId: post._id }),
                Comment.countDocuments({ postId: post._id }),
                Bookmark.countDocuments({ postId: post._id }),
                userId ? Like.exists({ postId: post._id, userId }) : false,
                userId ? Bookmark.exists({ postId: post._id, userId }) : false,
            ]);
            return { ...plain, likeCount, commentCount, favoriteCount, likedByMe: !!likedByMe, favoritedByMe: !!favoritedByMe };
        })
    );
}

export async function getFeed(req: Request, res: Response) {
    try {
        const userId = req.user!.userId;

        const [following, memberships] = await Promise.all([
            Follow.find({ followerId: userId }).select("followingId"),
            GroupMembership.find({ userId, status: "approved" }).select("groupId"),
        ]);
        const followingIds = following.map((f) => f.followingId.toString());
        const groupIds = memberships.map((m) => m.groupId.toString());

        const posts = await postService.getFeed(userId, followingIds, groupIds);
        const decorated = await decoratePosts(posts, userId);
        res.status(200).json(decorated);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function getGroupPosts(req: Request<{ groupId: string }>, res: Response) {
    try {
        const posts = await postService.getPostsByGroup(req.params.groupId);
        const decorated = await decoratePosts(posts, req.user?.userId);
        res.status(200).json(decorated);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function getPostsByTag(req: Request<{ tag: string }>, res: Response) {
    try {
        const posts = await postService.getPostsByTag(req.params.tag);
        const decorated = await decoratePosts(posts, req.user?.userId);
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