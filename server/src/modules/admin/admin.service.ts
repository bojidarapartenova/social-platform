import { AdminRepository } from "./admin.repository";

export class AdminService {
    constructor(private adminRepo: AdminRepository = new AdminRepository()) { }

    getStats() {
        return this.adminRepo.getStats();
    }

    async getUsers(search: string, page: number, limit: number) {
        const [users, total] = await this.adminRepo.findUsers(search, page, limit);
        return { users, total, page, limit };
    }

    async setUserRole(targetUserId: string, requesterId: string, role: "user" | "admin") {
        if (targetUserId === requesterId) {
            throw new Error("You can't change your own role");
        }

        const user = await this.adminRepo.setUserRole(targetUserId, role);
        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    async deleteUser(targetUserId: string, requesterId: string) {
        if (targetUserId === requesterId) {
            throw new Error("You can't delete your own account from here");
        }
        const user = await this.adminRepo.findUserById(targetUserId);
        if (!user) throw new Error("User not found");
        await this.adminRepo.deleteUserCascade(targetUserId);
    }

    async getPosts(page: number, limit: number) {
        const [posts, total] = await this.adminRepo.findPosts(page, limit);
        return { posts, total, page, limit };
    }

    async deletePost(postId: string) {
        await this.adminRepo.deletePostCascade(postId);
    }

    async getGroups(page: number, limit: number) {
        const [groups, total] = await this.adminRepo.findGroups(page, limit);
        return { groups, total, page, limit };
    }

    async deleteGroup(groupId: string) {
        await this.adminRepo.deleteGroupCascade(groupId);
    }

    async getComments(page: number, limit: number) {
        const [comments, total] = await this.adminRepo.findComments(page, limit);
        return { comments, total, page, limit };
    }

    async deleteComment(commentId: string) {
        await this.adminRepo.deleteCommentCascade(commentId);
    }
}