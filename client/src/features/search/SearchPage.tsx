import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSearchQuery, useGetPopularPostsQuery } from "./searchApiSlice";
import { FilteredImage } from "../feed/FilteredImage";
import "../../styles/search.css";

export function SearchPage() {
    const [inputValue, setInputValue] = useState("");
    const [query, setQuery] = useState("");

    useEffect(() => {
        const handle = setTimeout(() => setQuery(inputValue.trim()), 400);
        return () => clearTimeout(handle);
    }, [inputValue]);

    const { data: results, isLoading: isSearching } = useSearchQuery(query, { skip: !query });
    const { data: popularPosts, isLoading: isLoadingPopular } = useGetPopularPostsQuery(undefined, { skip: !!query });

    const hasNoResults =
        query && results &&
        results.users.length === 0 &&
        results.groups.length === 0 &&
        results.posts.length === 0;

    return (
        <div className="forYou">
            <p className="feedScopeSelect">Search</p>

            <div className="feed">
                <div className="searchBarRow">
                    <input
                        className="searchInput"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Search users, groups, or #tags"
                    />
                </div>

                <div className="postList">
                    {query ? (
                        <>
                            {isSearching && <p>Searching...</p>}

                            {results && results.users.length > 0 && (
                                <div className="searchSection">
                                    <p className="searchSectionTitle">Users</p>
                                    {results.users.map((u) => (
                                        <Link key={u._id} to={`/profile/${u._id}`} className="searchResultRow">
                                            <img src={u.avatarUrl || "/default-avatar.png"} alt={u.username} />
                                            <div>
                                                <span className="searchResultName">{u.name || u.username}</span>
                                                <p className="searchResultSub">@{u.username}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {results && results.groups.length > 0 && (
                                <div className="searchSection">
                                    <p className="searchSectionTitle">Groups</p>
                                    {results.groups.map((g) => (
                                        <Link key={g._id} to={`/groups/${g._id}`} className="searchResultRow">
                                            <img src={g.avatarUrl || "/default-avatar.png"} alt={g.name} />
                                            <div>
                                                <span className="searchResultName">{g.name}</span>
                                                {g.description && <p className="searchResultSub">{g.description}</p>}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {results && results.posts.length > 0 && (
                                <div className="searchSection">
                                    <p className="searchSectionTitle">Posts</p>
                                    {results.posts.map((post) => (
                                        <Link key={post._id} to={`/posts/${post._id}`} className="searchResultRow">
                                            <div className="searchResultThumb">
                                                {post.media?.[0] ? (
                                                    <FilteredImage src={post.media[0].url} filter={post.media[0].filter} />
                                                ) : (
                                                    <div className="searchResultTextIcon">Aa</div>
                                                )}
                                            </div>
                                            <div>
                                                <span className="searchResultName">{post.authorId.username}</span>
                                                <p className="searchResultSub">{post.caption}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {hasNoResults && (
                                <p style={{ textAlign: "center", color: "var(--color-text-muted)", marginTop: "2rem" }}>
                                    No results for "{query}"
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="searchSectionTitle">Popular</p>
                            {isLoadingPopular && <p>Loading...</p>}
                            <div className="searchGrid">
                                {popularPosts?.map((post) => (
                                    <Link key={post._id} to={`/posts/${post._id}`} className="searchGridItem">
                                        {post.media?.[0] && <FilteredImage src={post.media[0].url} filter={post.media[0].filter} />}
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}