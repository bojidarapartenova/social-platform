import { useGetFavoritePostsQuery } from "./postApiSlice";
import { PostCard } from "./PostCard";
import "../../styles/feed.css";

export function FavoritesPage() {
    const { data: favoritePosts, isLoading, isError } = useGetFavoritePostsQuery();

    return (
        <div className="forYou">
            <p className="feedScopeSelect">Saved</p>

            <div className="feed">
                <div className="postList">
                    {isLoading && <p>Loading favorites...</p>}
                    {isError && <p>Error loading favorites.</p>}
                    {!isLoading && favoritePosts?.length === 0 && (
                        <p style={{ textAlign: "center", color: "var(--color-text-muted)", marginTop: "2rem" }}>
                            You haven't added any posts to your favorites yet.
                        </p>
                    )}
                    {favoritePosts?.map((post) => <PostCard key={post._id} post={post} />)}
                </div>
            </div>
        </div>
    );
}