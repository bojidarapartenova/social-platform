import { PostRepository } from "./post.repository";
import { PostType, IMediaItem } from "./post.model";
import { GroupMembership } from "../groups/groupMembership.model";
import { Group } from "../groups/group.model";

interface CreatePostInput {
    type: PostType;
    caption?: string;
    media?: IMediaItem[];
    groupId?: string | null;
}

export class PostService {
    constructor(private postRepo: PostRepository = new PostRepository()) { }

    async createPost(authorId: string, data: CreatePostInput) {
        if (data.groupId) {
            const membership = await GroupMembership.findOne({
                groupId: data.groupId,
                userId: authorId,
                status: "approved",
            });
            if (!membership) throw new Error("You must be an approved member of this group to post");
        }

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

    async getFeed(userId: string, followingIds: string[], groupIds: string[]) {
        return this.postRepo.findManyWithAuthor({
            $or: [
                { authorId: { $in: [userId, ...followingIds] }, groupId: null },
                { groupId: { $in: groupIds } },
            ],
        });
    }

    async getPostsByGroup(groupId: string) {
        return this.postRepo.findManyWithAuthor({ groupId });
    }

    async getPostsByAuthor(authorId: string) {
        return this.postRepo.findManyWithAuthor({ authorId, groupId: null });
    }

    async getPostsByTag(tag: string) {
        const regex = new RegExp(`#${tag}\\b`, "i");
        return this.postRepo.findManyWithAuthor({ caption: regex });
    }

    async deletePost(id: string, requesterId: string) {
        const post = await this.postRepo.findById(id);
        if (!post) throw new Error("Post not found");

        const isAuthor = post.authorId.toString() === requesterId;
        let isGroupOwner = false;
        if (!isAuthor && post.groupId) {
            const group = await Group.findById(post.groupId);
            isGroupOwner = !!group && group.ownerId.toString() === requesterId;
        }

        if (!isAuthor && !isGroupOwner) throw new Error("Forbidden");
        await this.postRepo.deleteById(id);
    }

    async updatePost(id: string, requesterId: string, data: Partial<CreatePostInput>) {
        const post = await this.postRepo.findById(id);
        if (!post) throw new Error("Post not found");
        if (post.authorId.toString() !== requesterId) throw new Error("Forbidden");
        return this.postRepo.updateById(id, data as any);
    }
}