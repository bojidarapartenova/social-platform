import { useGetFeedQuery } from "./postApiSlice";
import { PostCard } from "./PostCard";
import { Link } from "react-router-dom";
import "../../styles/feed.css";

export function FeedPage() {
    const { data: posts, isLoading, error } = useGetFeedQuery();

    return (
        <div className="feed">
            <div className="postForm">
                <p>What's new?</p>
                <Link to="/create">+</Link>
            </div>

            <div className="postList">
                {isLoading && <p>Loading feed...</p>}
                {error && <p>Couldn't load the feed.</p>}
                {posts?.map((post) => <PostCard key={post._id} post={post} />)}
            </div>
        </div>
    );
}