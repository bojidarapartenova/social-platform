import { useGetPendingRequestsQuery, useApproveRequestMutation, useRejectRequestMutation } from "./groupApiSlice";

export function GroupRequestsPanel({ groupId }: { groupId: string }) {
    const { data: requests } = useGetPendingRequestsQuery(groupId);
    const [approve] = useApproveRequestMutation();
    const [reject] = useRejectRequestMutation();

    if (!requests || requests.length === 0) return null;

    return (
        <div className="groupRequests">
            <p className="groupRequestsTitle">Join requests ({requests.length})</p>
            {requests.map((r) => (
                <div key={r._id} className="groupRequestRow">
                    <img src={r.userId.avatarUrl || "/default-avatar.png"} alt={r.userId.username} />
                    <span>{r.userId.username}</span>
                    <div className="groupRequestActions">
                        <button type="button" onClick={() => approve({ groupId, userId: r.userId._id })}>Accept</button>
                        <button type="button" onClick={() => reject({ groupId, userId: r.userId._id })}>Decline</button>
                    </div>
                </div>
            ))}
        </div>
    );
}