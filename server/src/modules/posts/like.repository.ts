import { Like, ILike } from "./like.model";

export class LikeRepository {
    findOne(filter: Partial<ILike>) {
        return Like.findOne(filter).exec();
    }
    create(data: Partial<ILike>) {
        return Like.create(data);
    }
    deleteOne(filter: Partial<ILike>) {
        return Like.deleteOne(filter).exec();
    }
    countByPost(postId: string) {
        return Like.countDocuments({ postId }).exec();
    }
}