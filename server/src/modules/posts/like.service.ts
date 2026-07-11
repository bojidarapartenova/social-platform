import { LikeRepository } from "./like.repository";

export class LikeService {
    constructor(private likeRepo: LikeRepository = new LikeRepository()) { }

    async toggleLike(postId: string, userId: string) {
        const existing = await this.likeRepo.findOne({ postId, userId } as any);

        if (existing) {
            await this.likeRepo.deleteOne({ postId, userId } as any);
        } else {
            await this.likeRepo.create({ postId, userId } as any);
        }

        const likeCount = await this.likeRepo.countByPost(postId);
        return { liked: !existing, likeCount };
    }
}