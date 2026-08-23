import { ReportRepository } from "./report.repository";
import { AdminService } from "../admin/admin.service";
import { Post } from "../posts/post.model";
import { Comment } from "../posts/comment.model";
import { User } from "../users/user.model";
import { ReportStatus } from "./report.model";

export class ReportService {
    constructor(
        private reportRepo: ReportRepository = new ReportRepository(),
        private adminService: AdminService = new AdminService()
    ) { }

    createReport(reporterId: string, targetType: "post" | "comment" | "user", targetId: string, reason: string, details?: string) {
        return this.reportRepo.create({ reporterId, targetType, targetId, reason, details: details ?? "" } as any);
    }

    async getReports(status: string, page: number, limit: number) {
        const [reportsRaw, total] = await this.reportRepo.findAll(status as ReportStatus | "", page, limit);
        const reports = await Promise.all(
            reportsRaw.map(async (r: any) => {
                let preview: any = null;
                if (r.targetType === "post") {
                    const post = await Post.findById(r.targetId).populate("authorId", "username");
                    preview = post ? { text: post.caption, authorUsername: (post.authorId as any)?.username } : null;
                } else if (r.targetType === "comment") {
                    const comment = await Comment.findById(r.targetId).populate("authorId", "username");
                    preview = comment ? { text: comment.text, authorUsername: (comment.authorId as any)?.username } : null;
                } else if (r.targetType === "user") {
                    const user = await User.findById(r.targetId).select("username");
                    preview = user ? { text: user.username } : null;
                }
                return { ...r.toObject(), preview };
            })
        );

        return { reports, total, page, limit };
    }

    async dismissReport(id: string) {
        const report = await this.reportRepo.updateStatus(id, "dismissed");
        if (!report) throw new Error("Report not found");
        return report;
    }

    async resolveReport(id: string, requesterId: string) {
        const report = await this.reportRepo.findById(id);
        if (!report) throw new Error("Report not found");

        if (report.targetType === "post") {
            await this.adminService.deletePost(report.targetId.toString());
        } else if (report.targetType === "comment") {
            await this.adminService.deleteComment(report.targetId.toString());
        } else if (report.targetType === "user") {
            await this.adminService.deleteUser(report.targetId.toString(), requesterId);
        }

        return this.reportRepo.updateStatus(id, "resolved");
    }
}