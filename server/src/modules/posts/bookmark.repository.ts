import { Bookmark, IBookmark } from "./bookmark.model";
import { decoratePosts } from "./post.controller";

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

    countByPost(postId: string) {
        return Bookmark.countDocuments({ postId }).exec();
    }

    async findUserFavorites(userId: string) {
        const bookmarks = await Bookmark.find({ userId })
            .populate({
                path: "postId",
                populate: [
                    { path: "authorId", select: "username name avatarUrl" },
                    { path: "groupId", select: "name avatarUrl ownerId" },
                ],
            })
            .sort({ createdAt: -1 })
            .exec();

        const posts = bookmarks
            .filter((b) => b.postId !== null)
            .map((b) => b.postId as any);

        return decoratePosts(posts, userId);
    }
}