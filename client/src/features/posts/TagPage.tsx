import { useParams } from "react-router-dom";
import { useGetPostsByTagQuery } from "./postApiSlice";
import { PostCard } from "./PostCard";
import "../../styles/feed.css";

export function TagPage() {
    const { tag } = useParams<{ tag: string }>();
    const { data: posts, isLoading } = useGetPostsByTagQuery(tag!);

    return (
        <div className="forYou">
            <p className="feedScopeSelect">#{tag}</p>
            <div className="feed">
                <div className="postList">
                    {isLoading && <p>Loading...</p>}
                    {posts?.length === 0 && (
                        <p style={{ textAlign: "center", color: "var(--color-text-muted)", marginTop: "2rem" }}>
                            No posts with this tag yet.
                        </p>
                    )}
                    {posts?.map((post) => <PostCard key={post._id} post={post} />)}
                </div>
            </div>
        </div>
    );
}