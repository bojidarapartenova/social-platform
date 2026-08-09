import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useGetFeedQuery } from "./postApiSlice";
import { PostCard } from "./PostCard";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetDraft } from "./postDraftSlice";
import "../../styles/feed.css";

export function FeedPage() {
    const [scope, setScope] = useState<"all" | "following">("all");
    const { data: posts, isLoading, error } = useGetFeedQuery(scope);
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();

    return (
        <div className="forYou">
            <p className="feedScopeSelect">For You</p>

            <div className="feed">
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
                    {isLoading && <p>Loading feed...</p>}
                    {error && <p>Couldn't load the feed.</p>}
                    {posts?.map((post) => <PostCard key={post._id} post={post} />)}
                </div>
            </div>
        </div>
    );
}