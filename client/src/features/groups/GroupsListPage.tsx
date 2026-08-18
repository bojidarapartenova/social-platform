import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetMyGroupsQuery, useGetPendingGroupsQuery, useGetSuggestedGroupsQuery } from "./groupApiSlice";
import type { Group, MyGroupSummary } from "./groupApiSlice";
import "../../styles/groups.css";

type Tab = "mine" | "pending" | "explore";

const TAB_LABELS: Record<Tab, string> = {
    mine: "My Groups",
    pending: "Pending",
    explore: "Explore",
};

const EMPTY_MESSAGES: Record<Tab, string> = {
    mine: "You're not a member of any group yet.",
    pending: "No pending requests.",
    explore: "No suggestions right now.",
};

export function GroupsListPage() {
    const [tab, setTab] = useState<Tab>("mine");

    const mine = useGetMyGroupsQuery(undefined, { skip: tab !== "mine" });
    const pending = useGetPendingGroupsQuery(undefined, { skip: tab !== "pending" });
    const explore = useGetSuggestedGroupsQuery(undefined, { skip: tab !== "explore" });

    const active = { mine, pending, explore }[tab];
    const groups: (Group | MyGroupSummary)[] | undefined = active.data;
    const isLoading = active.isLoading;

    return (
        <div className="forYou">
            <div className="groupsHeader">
                <p className="feedScopeSelect">Groups</p>
                <Link to="/groups/new" className="profileBtn primary groupsNewBtn">+ New group</Link>
            </div>

            <div className="feed">
                <div className="groupTabs">
                    {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
                        <button
                            key={t}
                            type="button"
                            className={t === tab ? "groupTabBtn active" : "groupTabBtn"}
                            onClick={() => setTab(t)}
                        >
                            {TAB_LABELS[t]}
                        </button>
                    ))}
                </div>

                <div className="postList">
                    {isLoading && <p>Loading...</p>}
                    {groups?.length === 0 && (
                        <p style={{ textAlign: "center", color: "var(--color-text-muted)", marginTop: "2rem" }}>
                            {EMPTY_MESSAGES[tab]}
                        </p>
                    )}
                    <div className="groupsGrid">
                        {groups?.map((g) => (
                            <Link key={g._id} to={`/groups/${g._id}`} className="groupCard">
                                <img src={g.avatarUrl || "/default-avatar.png"} alt={g.name} />
                                <span>{g.name}</span>
                                {"isOwner" in g && g.isOwner && <span className="ownerBadge">Owner</span>}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}