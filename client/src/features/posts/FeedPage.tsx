import { useGetFeedQuery } from "./postApiSlice";
import { FilteredImage } from "../feed/FilteredImage";
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

                {posts?.map((post) => (
                    <div key={post._id} className="post">
                        <div className="postHeader">
                            <img
                                src={post.authorId.avatarUrl || "/default-avatar.png"}
                                alt={post.authorId.username}
                            />
                            <Link to="/profile"><span>{post.authorId.username}</span></Link>
                        </div>

                        <p className="postCaption">{post.caption}</p>

                        {post.type === "photo" && post.mediaUrls?.length > 0 && (
                            <div className="mediaScroll">
                                {post.mediaUrls.map((url, i) => (
                                    <FilteredImage key={i} src={url} filter={post.filter} />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}