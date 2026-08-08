import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { Link } from "react-router-dom";
import { FilteredImage } from "../feed/FilteredImage";
import {
    useToggleLikeMutation, useGetCommentsQuery, useAddCommentMutation, useDeleteCommentMutation,
    useUpdatePostMutation, useDeletePostMutation, useToggleFavoriteMutation,
} from "./postApiSlice";
import type { Post } from "./postApiSlice";
import { HashtagText } from "../../components/HashtagText";

function HeartIcon({ filled }: { filled: boolean }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
        </svg>
    );
}

function CommentIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
    );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
    );
}

export function PostCard({ post, isGroupOwner = false, forceShowComments = false }: { post: Post; isGroupOwner?: boolean; forceShowComments?: boolean }) {
    const currentUserId = useSelector((state: RootState) => state.auth.user?._id);
    const isOwner = currentUserId === post.authorId._id;
    const canDelete = isOwner || isGroupOwner;

    const [toggleLike] = useToggleLikeMutation();
    const [toggleFavorite] = useToggleFavoriteMutation();
    const [showComments, setShowComments] = useState(forceShowComments);
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editCaption, setEditCaption] = useState(post.caption);

    const [updatePost] = useUpdatePostMutation();
    const [deletePost] = useDeletePostMutation();

    const { data: comments } = useGetCommentsQuery(post._id, { skip: !showComments });
    const [commentText, setCommentText] = useState("");
    const [addComment] = useAddCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();
    const [activeSlide, setActiveSlide] = useState(0);

    async function handleSaveEdit() {
        await updatePost({ id: post._id, data: { caption: editCaption } });
        setIsEditing(false);
        setShowMenu(false);
    }

    async function handleDelete() {
        if (confirm("Delete this post?")) {
            await deletePost(post._id);
        }
    }

    async function handleAddComment(e: React.FormEvent) {
        e.preventDefault();
        if (!commentText.trim()) return;
        await addComment({ postId: post._id, text: commentText });
        setCommentText("");
    }

    function StackIcon() {
        return (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="7" y="7" width="14" height="14" rx="2" fill="black" fillOpacity="0.3" />
                <rect x="3" y="3" width="14" height="14" rx="2" fill="black" fillOpacity="0.5" />
            </svg>
        );
    }

    function handleMediaScroll(e: React.UIEvent<HTMLDivElement>) {
        const el = e.currentTarget;
        const index = Math.round(el.scrollLeft / el.clientWidth);
        setActiveSlide(index);
    }

    return (
        <div className="post">
            <div className="postHeader">
                <Link to={`/profile/${post.authorId._id}`} className="postAuthorLink">
                    <img src={post.authorId.avatarUrl || "/default-avatar.png"} alt={post.authorId.username} />
                    <span>{post.authorId.username}</span>
                </Link>

                {post.groupId && (
                    <Link to={`/groups/${post.groupId._id}`} className="postGroupTag">
                        in {post.groupId.name}
                    </Link>
                )}

                {canDelete && (
                    <div className="postMenu">
                        <button type="button" className="menuBtn" onClick={() => setShowMenu((v) => !v)} aria-label="Post options">
                            ...
                        </button>
                        {showMenu && (
                            <div className="menuDropdown">
                                {isOwner && <button type="button" onClick={() => { setIsEditing(true); setShowMenu(false); }}>Edit</button>}
                                <button type="button" onClick={handleDelete}>Delete</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isEditing ? (
                <div className="editBox">
                    <textarea value={editCaption} onChange={(e) => setEditCaption(e.target.value)} />
                    <div className="editActions">
                        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                        <button type="button" onClick={handleSaveEdit}>Save</button>
                    </div>
                </div>
            ) : (
                <p className="postCaption"><HashtagText text={post.caption} /></p>
            )}

            {post.type === "photo" && post.media?.length > 0 && (
                <div className="mediaWrapper">
                    {post.media.length > 1 && (
                        <div className="mediaCountBadge">
                            <StackIcon />
                        </div>
                    )}

                    <div className="mediaScroll" onScroll={handleMediaScroll}>
                        {post.media.map((item, i) => (
                            <FilteredImage key={i} src={item.url} filter={item.filter} />
                        ))}
                    </div>

                    {post.media.length > 1 && (
                        <div className="mediaDots">
                            {post.media.map((_, i) => (
                                <span key={i} className={i === activeSlide ? "mediaDot active" : "mediaDot"} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="postActions">
                <button
                    type="button"
                    className={post.likedByMe ? "actionBtn liked" : "actionBtn"}
                    onClick={() => toggleLike(post._id)}
                    aria-label={post.likedByMe ? "Unlike post" : "Like post"}
                >
                    <HeartIcon filled={post.likedByMe} /> {post.likeCount}
                </button>
                <button type="button" className="actionBtn" onClick={() => setShowComments((v) => !v)} aria-label="View comments">
                    <CommentIcon /> {post.commentCount}
                </button>
                <button
                    type="button"
                    className={post.favoritedByMe ? "actionBtn favorited" : "actionBtn"}
                    onClick={() => toggleFavorite(post._id)}
                    aria-label={post.favoritedByMe ? "Remove from favorites" : "Add to favorites"}
                >
                    <BookmarkIcon filled={post.favoritedByMe} /> {post.favoriteCount}
                </button>
            </div>

            {showComments && (
                <div className="commentSection">
                    {comments?.map((c) => (
                        <div key={c._id} className="comment">
                            <span className="commentAuthor">{c.authorId.username}</span> {c.text}
                            {c.authorId._id === currentUserId && (
                                <button type="button" className="deleteCommentBtn" onClick={() => deleteComment({ id: c._id, postId: post._id })}>✕</button>
                            )}
                        </div>
                    ))}
                    <form className="commentForm" onSubmit={handleAddComment}>
                        <input
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                        />
                        <button type="submit">Post</button>
                    </form>
                </div>
            )}
        </div>
    );
}