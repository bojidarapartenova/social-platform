import { CommentRepository } from "./comment.repository";

export class CommentService {
    constructor(private commentRepo: CommentRepository = new CommentRepository()) { }

    async addComment(postId: string, authorId: string, text: string) {
        if (!text.trim()) throw new Error("Comment cannot be empty");
        return this.commentRepo.create({ postId, authorId, text: text.trim() } as any);
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