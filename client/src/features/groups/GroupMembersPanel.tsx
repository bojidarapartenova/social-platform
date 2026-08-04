import { useGetMembersQuery, useKickMemberMutation, useBanMemberMutation } from "./groupApiSlice";

export function GroupMembersPanel({ groupId }: { groupId: string }) {
    const { data: members } = useGetMembersQuery(groupId);
    const [kickMember] = useKickMemberMutation();
    const [banMember] = useBanMemberMutation();

    if (!members) return null;

    return (
        <div className="groupRequests">
            <p className="groupRequestsTitle">Members ({members.length})</p>
            {members.map((m) => (
                <div key={m._id} className="groupRequestRow">
                    <img src={m.userId.avatarUrl || "/default-avatar.png"} alt={m.userId.username} />
                    <span>{m.userId.username}{m.role === "owner" ? " (owner)" : ""}</span>
                    {m.role !== "owner" && (
                        <div className="groupRequestActions">
                            <button type="button" onClick={() => kickMember({ groupId, userId: m.userId._id })}>Kick</button>
                            <button type="button" className="banBtn" onClick={() => banMember({ groupId, userId: m.userId._id })}>Ban</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}