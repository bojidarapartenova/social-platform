import { Link } from "react-router-dom";
import { useGetMyGroupsQuery } from "./groupApiSlice";
import "../../styles/groups.css";

export function GroupsListPage() {
    const { data: groups, isLoading } = useGetMyGroupsQuery();

    return (
        <div className="forYou">
            <div className="groupsHeader">
                <p className="feedScopeSelect">Groups</p>
                <Link to="/groups/new" className="profileBtn primary groupsNewBtn">+ New group</Link>
            </div>

            <div className="feed">
                <div className="postList">
                    {isLoading && <p>Loading...</p>}
                    {groups?.length === 0 && (
                        <p style={{ textAlign: "center", color: "var(--color-text-muted)", marginTop: "2rem" }}>
                            You're not in any groups yet.
                        </p>
                    )}
                    <div className="groupsGrid">
                        {groups?.map((g) => (
                            <Link key={g._id} to={`/groups/${g._id}`} className="groupCard">
                                <img src={g.avatarUrl || "/default-avatar.png"} alt={g.name} />
                                <span>{g.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}