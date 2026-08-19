import { Post, IPost } from "./post.model";
import { IRepository } from "../../common/repository";
import { Types } from "mongoose";
import { Like } from "./like.model";

export class PostRepository implements IRepository<IPost> {
    findById(id: string) {
        return Post.findById(id).exec();
    }
    findOne(filter: Partial<IPost>) {
        return Post.findOne(filter).exec();
    }
    create(data: Partial<IPost>) {
        return Post.create(data);
    }
    updateById(id: string, data: Partial<IPost>) {
        return Post.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    deleteById(id: string) {
        return Post.findByIdAndDelete(id).exec();
    }
    findMany(filter: any, limit = 20) {
        return Post.find(filter).sort({ createdAt: -1 }).limit(limit).exec();
    }
    findManyWithAuthor(filter: any, limit = 20) {
        return Post.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("authorId", "username avatarUrl name")
            .populate("groupId", "name avatarUrl ownerId")
            .exec();
    }
    findByIdWithAuthor(id: string) {
        return Post.findById(id)
            .populate("authorId", "username avatarUrl name")
            .populate("groupId", "name avatarUrl ownerId")
            .exec();
    }
    findPopular(limit = 40) {
        return Post.aggregate([
            { $match: { type: "photo", groupId: null, "media.0": { $exists: true } } },
            { $lookup: { from: "likes", localField: "_id", foreignField: "postId", as: "likes" } },
            { $addFields: { likeScore: { $size: "$likes" } } },
            { $sort: { likeScore: -1, createdAt: -1 } },
            { $limit: limit },
            { $lookup: { from: "users", localField: "authorId", foreignField: "_id", as: "authorId" } },
            { $unwind: "$authorId" },
            {
                $addFields: {
                    authorId: {
                        _id: "$authorId._id",
                        username: "$authorId.username",
                        name: "$authorId.name",
                        avatarUrl: "$authorId.avatarUrl",
                    },
                }
            },
        ]);

    }

    async findSuggestions(userId?: string, limit = 20) {
        let preferredAuthorIds: Types.ObjectId[] = [];

        if (userId) {
            const userLikes = await Like.find({ userId: new Types.ObjectId(userId) }).select("postId").exec();
            const likedPostIds = userLikes.map((l) => l.postId);

            if (likedPostIds.length > 0) {
                const likedPosts = await Post.find({ _id: { $in: likedPostIds } }).select("authorId").exec();
                preferredAuthorIds = Array.from(
                    new Set(likedPosts.map((p) => p.authorId.toString()))
                ).map((id) => new Types.ObjectId(id));
            }
        }

        return Post.aggregate([
            { $match: { type: "photo", groupId: null, "media.0": { $exists: true } } },
            { $lookup: { from: "likes", localField: "_id", foreignField: "postId", as: "likes" } },
            { $addFields: { likeScore: { $size: "$likes" } } },
            {
                $addFields: {
                    isPreferred: { $in: ["$authorId", preferredAuthorIds] },
                },
            },
            { $sort: { isPreferred: -1, likeScore: -1, createdAt: -1 } },
            { $limit: limit },
            { $lookup: { from: "users", localField: "authorId", foreignField: "_id", as: "authorId" } },
            { $unwind: "$authorId" },
            {
                $addFields: {
                    authorId: {
                        _id: "$authorId._id",
                        username: "$authorId.username",
                        name: "$authorId.name",
                        avatarUrl: "$authorId.avatarUrl",
                    },
                },
            },
        ]);
    }
}