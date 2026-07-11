import { Bookmark, IBookmark } from "./bookmark.model";

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
}