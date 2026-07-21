import { PostRepository } from "./post.repository";
import { PostType, IMediaItem } from "./post.model";

interface CreatePostInput {
    type: PostType;
    caption?: string;
    media?: IMediaItem[];
    groupId?: string | null;
}

export class PostService {
    constructor(private postRepo: PostRepository = new PostRepository()) { }

    async createPost(authorId: string, data: CreatePostInput) {
        return this.postRepo.create({
            authorId,
            type: data.type,
            caption: data.caption ?? "",
            media: data.media ?? [],
            groupId: data.groupId || null,
        } as any);
    }

    async getPostById(id: string) {
        const post = await this.postRepo.findById(id);
        if (!post) throw new Error("Post not found");
        return post;
    }

    async getFeed() {
        return this.postRepo.findManyWithAuthor({ groupId: null });
    }

    async deletePost(id: string, requesterId: string) {
        const post = await this.postRepo.findById(id);
        if (!post) throw new Error("Post not found");
        if (post.authorId.toString() !== requesterId) throw new Error("Forbidden");
        await this.postRepo.deleteById(id);
    }

    async updatePost(id: string, requesterId: string, data: Partial<CreatePostInput>) {
        const post = await this.postRepo.findById(id);
        if (!post) throw new Error("Post not found");
        if (post.authorId.toString() !== requesterId) throw new Error("Forbidden");
        return this.postRepo.updateById(id, data as any);
    }

    async getPostsByAuthor(authorId: string) {
        return this.postRepo.findManyWithAuthor({ authorId, groupId: null });
    }

    async getFollowingFeed(userId: string, followingIds: string[]) {
        return this.postRepo.findManyWithAuthor({
            authorId: { $in: [userId, ...followingIds] },
            groupId: null,
        });
    }
}