import { useGetFavoritePostsQuery } from "./postApiSlice";
import { PostCard } from "./PostCard";
import "../../styles/feed.css";

export function FavoritesPage() {
    const { data: favoritePosts, isLoading, isError } = useGetFavoritePostsQuery();

    if (isLoading) return <div className="feed"><p>Loading favorites...</p></div>;
    if (isError) return <div className="feed"><p>Error loading favorites.</p></div>;

    return (
        <div className="feed">
            <div className="postForm">
                <div className="postFormLeft">
                    <p>Favorites ⭐</p>
                </div>
            </div>

            {!favoritePosts || favoritePosts.length === 0 ? (
                <div className="post" style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
                    <p>You haven't added any posts to your favorites yet.</p>
                </div>
            ) : (
                <div className="postList">
                    {favoritePosts.map((post) => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}