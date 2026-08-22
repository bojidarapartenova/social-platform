import { useGetAdminStatsQuery } from "./adminApiSlice";

export function AdminOverviewPage() {
    const { data: stats, isLoading } = useGetAdminStatsQuery();

    if (isLoading) return <p>Loading...</p>;
    if (!stats) return null;

    return (
        <div>
            <h1>Overview</h1>
            <div className="adminStatsGrid">
                <div className="adminStatCard"><span className="adminStatValue">{stats.totalUsers}</span><span>Total Users</span></div>
                <div className="adminStatCard"><span className="adminStatValue">{stats.totalPosts}</span><span>Total Posts</span></div>
                <div className="adminStatCard"><span className="adminStatValue">{stats.totalGroups}</span><span>Total Groups</span></div>
                <div className="adminStatCard"><span className="adminStatValue">{stats.totalComments}</span><span>Total Comments</span></div>
                <div className="adminStatCard"><span className="adminStatValue">{stats.newUsersThisWeek}</span><span>New Users (7 days)</span></div>
            </div>
        </div>
    );
}