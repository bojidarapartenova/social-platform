import { Request, Response } from "express";
import { followUser, unfollowUser, getFollowers, getFollowing, getFriends } from "./follow.service";

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

export async function unfollow(req: Request<{ followingId: string }>, res: Response) {
    try {
        const followerId = req.user!.userId;
        const { followingId } = req.params;
        await unfollowUser(followerId, followingId);
        res.status(200).json({ message: "Unfollowed" });
    }
    catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function listFollowers(req: Request<{ id: string }>, res: Response) {
    try {
        const users = await getFollowers(req.params.id, req.user?.userId);
        res.status(200).json(users);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function listFollowing(req: Request<{ id: string }>, res: Response) {
    try {
        const users = await getFollowing(req.params.id, req.user?.userId);
        res.status(200).json(users);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

export async function listFriends(req: Request, res: Response) {
    try {
        const friends = await getFriends(req.user!.userId);
        res.status(200).json(friends);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}