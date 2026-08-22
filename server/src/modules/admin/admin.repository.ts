import { User } from "../users/user.model";
import { Post } from "../posts/post.model";
import { Group } from "../groups/group.model";
import { Comment } from "../posts/comment.model";
import { Like } from "../posts/like.model";
import { Bookmark } from "../posts/bookmark.model";
import { Follow } from "../follows/follow.model";
import { Friendship } from "../follows/friendship.model";
import { GroupMembership } from "../groups/groupMembership.model";
import { Conversation } from "../chats/conversation.model";
import { Message } from "../chats/message.model";
import { Notification } from "../notifications/notification.model";

export class AdminRepository {
    async getStats() {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const [totalUsers, totalPosts, totalGroups, totalComments, newUsersThisWeek] = await Promise.all([
            User.countDocuments(),
            Post.countDocuments(),
            Group.countDocuments(),
            Comment.countDocuments(),
            User.countDocuments({ createdAt: { $gte: oneWeekAgo } }),
        ]);

        return { totalUsers, totalPosts, totalGroups, totalComments, newUsersThisWeek };
    }

    findUsers(search: string, page: number, limit: number) {
        const filter = search
            ? { $or: [{ username: new RegExp(search, "i") }, { email: new RegExp(search, "i") }] }
            : {};
        return Promise.all([
            User.find(filter).select("-password").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
            User.countDocuments(filter),
        ]);
    }

    findUserById(id: string) {
        return User.findById(id);
    }

    setUserRole(id: string, role: "user" | "admin") {
        return User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
    }

    findPosts(page: number, limit: number) {
        return Promise.all([
            Post.find()
                .populate("authorId", "username avatarUrl")
                .populate("groupId", "name")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Post.countDocuments(),
        ])
    }

    findGroups(page: number, limit: number) {
        return Promise.all([
            Group.find()
                .populate("ownerId", "username avatarUrl")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Group.countDocuments(),
        ]);
    }

    async deletePostCascade(postId: string) {
        await Promise.all([
            Like.deleteMany({ postId }),
            Comment.deleteMany({ postId }),
            Bookmark.deleteMany({ postId }),
        ]);
        await Post.findByIdAndDelete(postId);
    }

    async deleteGroupCascade(groupId: string) {
        const posts = await Post.find({ groupId }).select("_id");
        const postIds = posts.map((p) => p._id);
        await Promise.all([
            Like.deleteMany({ postId: { $in: postIds } }),
            Comment.deleteMany({ postId: { $in: postIds } }),
            Bookmark.deleteMany({ postId: { $in: postIds } }),
            Post.deleteMany({ groupId }),
            GroupMembership.deleteMany({ groupId }),
        ]);
        await Group.findByIdAndDelete(groupId);
    }

    async deleteUserCascade(userId: string) {
        const ownedGroups = await Group.find({ ownerId: userId }).select("_id");
        for (const group of ownedGroups) {
            await this.deleteGroupCascade(group._id.toString());
        }

        const ownPosts = await Post.find({ authorId: userId }).select("_id");
        for (const post of ownPosts) {
            await this.deletePostCascade(post._id.toString());
        }

        const conversations = await Conversation.find({ participantIds: userId }).select("_id");
        const conversationIds = conversations.map((c) => c._id);

        await Promise.all([
            Comment.deleteMany({ authorId: userId }),
            Like.deleteMany({ userId }),
            Bookmark.deleteMany({ userId }),
            Follow.deleteMany({ $or: [{ followerId: userId }, { followingId: userId }] }),
            Friendship.deleteMany({ $or: [{ userAId: userId }, { userBId: userId }] }),
            GroupMembership.deleteMany({ userId }),
            Message.deleteMany({ conversationId: { $in: conversationIds } }),
            Conversation.deleteMany({ _id: { $in: conversationIds } }),
            Notification.deleteMany({ $or: [{ recipientId: userId }, { actorId: userId }] }),
        ]);

        await User.findByIdAndDelete(userId);
    }
}