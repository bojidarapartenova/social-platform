import { BookmarkRepository } from "./bookmark.repository";

export class BookmarkService {
    constructor(private bookmarkRepo: BookmarkRepository = new BookmarkRepository()) { }

    async toggleFavorite(postId: string, userId: string) {
        const existing = await this.bookmarkRepo.findOne({ postId, userId } as any);
        if (existing) {
            await this.bookmarkRepo.deleteOne({ postId, userId } as any);
        } else {
            await this.bookmarkRepo.create({ postId, userId } as any);
        }
        return { favorited: !existing };
    }

    async getFavorites(userId: string) {
        return await this.bookmarkRepo.findUserFavorites(userId);
    }
}