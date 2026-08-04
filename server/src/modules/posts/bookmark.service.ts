import { BookmarkRepository } from "./bookmark.repository";

export class BookmarkService {
    constructor(private bookmarkRepo: BookmarkRepository = new BookmarkRepository()) { }

    async toggleFavorite(postId: string, userId: string) {
        try {
            const existing = await this.bookmarkRepo.findOne({ postId, userId } as any);
            if (existing) {
                await this.bookmarkRepo.deleteOne({ postId, userId } as any);
            } else {
                await this.bookmarkRepo.create({ postId, userId } as any);
            }
        } catch (err: any) {
            if (err.code !== 11000) throw err;
        }

        const stillFavorited = await this.bookmarkRepo.findOne({ postId, userId } as any);
        return { favorited: !!stillFavorited };
    }

    async getFavorites(userId: string) {
        return this.bookmarkRepo.findUserFavorites(userId);
    }
}