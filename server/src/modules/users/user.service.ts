import { UserRepository } from "./user.repository";
import { Follow } from "../follows/follow.model";
import { Friendship } from "../follows/friendship.model";

export type RelationshipStatus = "self" | "friend" | "following" | "none";

export class UserService {
    constructor(private userRepo: UserRepository = new UserRepository()) { }

    async getUserById(id: string, viewerId?: string) {
        const user = await this.userRepo.findById(id);
        if (!user) throw new Error("User not found");
        const { password, ...safeUser } = user.toObject();

        const [followerCount, followingCount] = await Promise.all([
            Follow.countDocuments({ followingId: id }),
            Follow.countDocuments({ followerId: id }),
        ]);

        let relationshipStatus: RelationshipStatus = "none";
        if (viewerId) {
            if (viewerId === id) {
                relationshipStatus = "self";
            } else {
                const [a, b] = viewerId < id ? [viewerId, id] : [id, viewerId];
                const isFriend = await Friendship.exists({ userAId: a, userBId: b });
                if (isFriend) {
                    relationshipStatus = "friend";
                } else {
                    const isFollowing = await Follow.exists({ followerId: viewerId, followingId: id });
                    relationshipStatus = isFollowing ? "following" : "none";
                }
            }
        }

        return { ...safeUser, followerCount, followingCount, relationshipStatus };
    }

    async updateUser(id: string, data: { name?: string; bio?: string; avatarUrl?: string }) {
        const user = await this.userRepo.updateById(id, data);
        if (!user) throw new Error("User not found");
        const { password, ...safeUser } = user.toObject();
        return safeUser;
    }
}