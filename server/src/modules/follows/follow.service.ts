import { Follow } from "./follow.model";
import { Friendship } from "./friendship.model";
import { Types } from "mongoose";

function sortedPair(a: Types.ObjectId, b: Types.ObjectId) {
    return a.toString() < b.toString() ? [a, b] : [b, a];
}

export async function followUser(followerId: string, followingId: string) {
    const followerObjId = new Types.ObjectId(followerId);
    const followingObjId = new Types.ObjectId(followingId);

    await Follow.create({ followerId: followerObjId, followingId: followingObjId });

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