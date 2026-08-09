import { Follow } from "./follow.model";
import { Friendship } from "./friendship.model";
import { Types } from "mongoose";
import { NotificationService } from "../notifications/notification.service";

const notificationService = new NotificationService();

function sortedPair(a: Types.ObjectId, b: Types.ObjectId) {
    return a.toString() < b.toString() ? [a, b] : [b, a];
}

export async function followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
        throw new Error("You can't follow yourself");
    }

    const followerObjId = new Types.ObjectId(followerId);
    const followingObjId = new Types.ObjectId(followingId);

    const alreadyFollowing = await Follow.exists({
        followerId: followerObjId,
        followingId: followingObjId,
    });
    if (alreadyFollowing) {
        return;
    }

    await Follow.create({ followerId: followerObjId, followingId: followingObjId });
    await notificationService.notify(followingId, followerId, "follow");

    const reverseFollowExists = await Follow.exists({
        followerId: followingObjId,
        followingId: followerObjId,
    });

    if (reverseFollowExists) {
        const [userAId, userBId] = sortedPair(followerObjId, followingObjId);
        await Friendship.findOneAndUpdate(
            { userAId, userBId },
            { userAId, userBId },
            { upsert: true, new: true }
        );
    }
}

export async function unfollowUser(followerId: string, followingId: string) {
    const followerObjId = new Types.ObjectId(followerId);
    const followingObjId = new Types.ObjectId(followingId);

    await Follow.deleteOne({ followerId: followerObjId, followingId: followingObjId });

    const [userAId, userBId] = sortedPair(followerObjId, followingObjId);
    await Friendship.deleteOne({ userAId, userBId });
}