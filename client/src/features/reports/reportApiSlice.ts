import { apiSlice } from "../../app/apiSlice";

export type ReportTargetType = "post" | "comment" | "user";
export type ReportReason = "spam" | "harassment" | "inappropriate" | "other";

export interface AdminReport {
    _id: string;
    targetType: ReportTargetType;
    targetId: string;
    reporterId: { _id: string; username: string; avatarUrl?: string };
    reason: ReportReason;
    details: string;
    status: "pending" | "resolved" | "dismissed";
    createdAt: string;
    preview: { text: string; authorUsername?: string } | null;
}

interface Paginated<T> {
    total: number;
    page: number;
    limit: number;
}

export const reportApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createReport: builder.mutation<{ message: string }, { targetType: ReportTargetType; targetId: string; reason: ReportReason; details?: string }>({
            query: (body) => ({ url: "/reports", method: "POST", body }),
        }),
        getAdminReports: builder.query<{ reports: AdminReport[] } & Paginated<AdminReport>, { status?: string; page?: number }>({
            query: ({ status = "pending", page = 1 }) => `/reports?status=${status}&page=${page}`,
            providesTags: ["AdminReport"],
        }),
        dismissReport: builder.mutation<{ message: string }, string>({
            query: (id) => ({ url: `/reports/${id}/dismiss`, method: "POST" }),
            invalidatesTags: ["AdminReport"],
        }),
        resolveReport: builder.mutation<{ message: string }, string>({
            query: (id) => ({ url: `/reports/${id}/resolve`, method: "POST" }),
            invalidatesTags: ["AdminReport", "Post", "Comment", "AdminUser", "AdminPost", "AdminComment"],
        }),
    }),
});

export const {
    useCreateReportMutation, useGetAdminReportsQuery, useDismissReportMutation, useResolveReportMutation,
} = reportApiSlice;