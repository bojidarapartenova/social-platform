import { Bookmark, IBookmark } from "./bookmark.model";
import { Like } from "./like.model";
import { Comment } from "./comment.model";

export class BookmarkRepository {
    findOne(filter: Partial<IBookmark>) {
        return Bookmark.findOne(filter).exec();
    }

    create(data: Partial<IBookmark>) {
        return Bookmark.create(data);
    }

    deleteOne(filter: Partial<IBookmark>) {
        return Bookmark.deleteOne(filter).exec();
    }

    async findUserFavorites(userId: string) {
        const bookmarks = await Bookmark.find({ userId })
            .populate({
                path: "postId",
                populate: { path: "authorId", select: "username name avatarUrl" }
            })
            .sort({ createdAt: -1 })
            .exec();

        const userLikes = await Like.find({ userId }).select("postId").exec();
        const likedPostIds = new Set(userLikes.map((l) => l.postId.toString()));

        const favoritedPosts = await Promise.all(
            bookmarks
                .filter((b) => b.postId !== null)
                .map(async (b) => {
                    const post = (b.postId as any).toObject();
                    const postIdStr = post._id.toString();

                    const likeCount = await Like.countDocuments({ postId: post._id });
                    const commentCount = await Comment.countDocuments({ postId: post._id });

                    return {
                        ...post,
                        likeCount: post.likeCount ?? likeCount,
                        commentCount: post.commentCount ?? commentCount,
                        favoritedByMe: true,
                        likedByMe: likedPostIds.has(postIdStr),
                    };
                })
        );

        return favoritedPosts;
    }
}