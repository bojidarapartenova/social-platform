import { Report, IReport, ReportStatus } from "./report.model";

export class ReportRepository {
    create(data: Partial<IReport>) {
        return Report.create(data);
    }

    findAll(status: ReportStatus | "", page: number, limit: number) {
        const filter = status ? { status } : {};
        return Promise.all([
            Report.find(filter)
                .populate("reporterId", "username avatarUrl")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Report.countDocuments(filter),
        ]);
    }

    findById(id: string) {
        return Report.findById(id);
    }

    updateStatus(id: string, status: ReportStatus) {
        return Report.findByIdAndUpdate(id, { status }, { new: true });
    }
}