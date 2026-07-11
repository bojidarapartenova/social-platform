import { Comment, IComment } from "./comment.model";

export class CommentRepository {
    create(data: Partial<IComment>) {
        return Comment.create(data);
    }
    findByPost(postId: string) {
        return Comment.find({ postId }).sort({ createdAt: 1 }).populate("authorId", "username avatarUrl").exec();
    }
    countByPost(postId: string) {
        return Comment.countDocuments({ postId }).exec();
    }
    findById(id: string) {
        return Comment.findById(id).exec();
    }
    deleteById(id: string) {
        return Comment.findByIdAndDelete(id).exec();
    }
}