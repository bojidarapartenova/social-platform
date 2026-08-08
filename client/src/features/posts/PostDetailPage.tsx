import { useParams } from "react-router-dom";
import { useGetPostByIdQuery } from "./postApiSlice";
import { PostCard } from "./PostCard";
import "../../styles/feed.css";

export function PostDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data: post, isLoading, error } = useGetPostByIdQuery(id!);

    return (
        <div className="forYou">
            <p className="feedScopeSelect">Post</p>
            <div className="feed">
                <div className="postList">
                    {isLoading && <p>Loading post...</p>}
                    {error && <p>This post doesn't exist.</p>}
                    {post && <PostCard post={post} forceShowComments />}
                </div>
            </div>
        </div>
    );
}