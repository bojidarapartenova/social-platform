import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "../../app/store";
import { useGetFeedQuery, useGetSuggestedPostsQuery } from "./postApiSlice";
import { resetDraft } from "./postDraftSlice";
import { PostCard } from "./PostCard";
import type { Post } from "./postApiSlice";
import "../../styles/feed.css";

type Tab = "explore" | "following";

const TAB_LABELS: Record<Tab, string> = {
    explore: "Explore",
    following: "Following",
};

const EMPTY_MESSAGES: Record<Tab, string> = {
    explore: "No suggestions right now.",
    following: "You don't follow anyone yet.",
};

export function FeedPage() {
    const [tab, setTab] = useState<Tab>("explore");
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();

    const explore = useGetSuggestedPostsQuery(undefined, { skip: tab !== "explore" });
    const following = useGetFeedQuery(undefined, { skip: tab !== "following" });

    const active = { explore, following }[tab];
    const posts: Post[] | undefined = active.data;
    const isLoading = active.isLoading;

    return (
        <div className="forYou">
            <p className="feedScopeSelect">Home</p>

            <div className="feed">
                <div className="postTabs">
                    {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
                        <button
                            key={t}
                            type="button"
                            className={t === tab ? "postTabBtn active" : "postTabBtn"}
                            onClick={() => setTab(t)}
                        >
                            {TAB_LABELS[t]}
                        </button>
                    ))}
                </div>

                <div className="postForm">
                    <div className="postFormLeft">
                        <Link to={`/profile/${currentUser?._id}`}>
                            <img
                                className="postFormPfp"
                                src={currentUser?.avatarUrl || "/default-avatar.png"}
                                alt={currentUser?.username}
                            />
                        </Link>
                        <p>What's new?</p>
                    </div>
                    <Link to="/create" onClick={() => dispatch(resetDraft())}>+</Link>
                </div>

                <div className="postList">
                    {isLoading && <p>Loading...</p>}
                    {!isLoading && posts?.length === 0 && (
                        <p style={{ textAlign: "center", color: "var(--color-text-muted)", marginTop: "2rem" }}>
                            {EMPTY_MESSAGES[tab]}
                        </p>
                    )}
                    {posts?.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    );
}