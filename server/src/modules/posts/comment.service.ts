import { CommentRepository } from "./comment.repository";
import { NotificationService } from "../notifications/notification.service";
import { Post } from "./post.model";

export class CommentService {
    constructor(
        private commentRepo: CommentRepository = new CommentRepository(),
        private notificationService: NotificationService = new NotificationService()
    ) { }

    async addComment(postId: string, authorId: string, text: string) {
        if (!text.trim()) throw new Error("Comment cannot be empty");
        const comment = await this.commentRepo.create({ postId, authorId, text: text.trim() } as any);

        const post = await Post.findById(postId);
        if (post) await this.notificationService.notify(post.authorId.toString(), authorId, "comment", postId);

        return comment;
    }

    async getComments(postId: string) {
        return this.commentRepo.findByPost(postId);
    }

    async deleteComment(commentId: string, requesterId: string) {
        const comment = await this.commentRepo.findById(commentId);
        if (!comment) throw new Error("Comment not found");
        if (comment.authorId.toString() !== requesterId) throw new Error("Forbidden");
        await this.commentRepo.deleteById(commentId);
    }
}