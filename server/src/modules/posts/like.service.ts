import { LikeRepository } from "./like.repository";
import { NotificationService } from "../notifications/notification.service";
import { Post } from "./post.model";

export class LikeService {
    constructor(
        private likeRepo: LikeRepository = new LikeRepository(),
        private notificationService: NotificationService = new NotificationService()
    ) { }

    async toggleLike(postId: string, userId: string) {
        let liked = false;
        try {
            const existing = await this.likeRepo.findOne({ postId, userId } as any);
            if (existing) {
                await this.likeRepo.deleteOne({ postId, userId } as any);
            } else {
                await this.likeRepo.create({ postId, userId } as any);
                liked = true;
            }
        } catch (err: any) {
            if (err.code !== 11000) throw err;
        }

        if (liked) {
            const post = await Post.findById(postId);
            if (post) await this.notificationService.notify(post.authorId.toString(), userId, "like", postId);
        }

        const likeCount = await this.likeRepo.countByPost(postId);
        const stillLiked = await this.likeRepo.findOne({ postId, userId } as any);
        return { liked: !!stillLiked, likeCount };
    }
}