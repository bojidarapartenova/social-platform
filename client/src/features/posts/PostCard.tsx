import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { FilteredImage } from "../feed/FilteredImage";
import {
    useToggleLikeMutation, useGetCommentsQuery, useAddCommentMutation, useDeleteCommentMutation,
    useUpdatePostMutation, useDeletePostMutation, useToggleFavoriteMutation,
} from "./postApiSlice";
import type { Post, MediaItem } from "./postApiSlice";
import { HashtagText } from "../../components/HashtagText";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadDraftFromPost } from "./postDraftSlice";

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

function StackIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect x="7" y="7" width="14" height="14" rx="2" fill="black" fillOpacity="0.3" />
            <rect x="3" y="3" width="14" height="14" rx="2" fill="black" fillOpacity="0.5" />
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
    const [activeSlide, setActiveSlide] = useState(0);

    const [isEditing, setIsEditing] = useState(false);
    const [editCaption, setEditCaption] = useState(post.caption);
    const [editMedia, setEditMedia] = useState<MediaItem[]>(post.media ?? []);
    const [editError, setEditError] = useState("");

    const [updatePost, { isLoading: isSavingEdit }] = useUpdatePostMutation();
    const [deletePost] = useDeletePostMutation();

    const { data: comments } = useGetCommentsQuery(post._id, { skip: !showComments });
    const [commentText, setCommentText] = useState("");
    const [addComment] = useAddCommentMutation();
    const [deleteComment] = useDeleteCommentMutation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function formatTime(iso: string) {
        return new Date(iso).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }

    function handleMediaScroll(e: React.UIEvent<HTMLDivElement>) {
        const el = e.currentTarget;
        const index = Math.round(el.scrollLeft / el.clientWidth);
        setActiveSlide(index);
    }

    function startEditing() {
        dispatch(loadDraftFromPost({ id: post._id, caption: post.caption, media: post.media ?? [] }));
        navigate("/create");
        setShowMenu(false);
    }

    function updateEditMediaUrl(index: number, value: string) {
        setEditMedia((prev) => prev.map((m, i) => (i === index ? { ...m, url: value } : m)));
    }

    function updateEditMediaFilter(index: number, filter: MediaItem["filter"]) {
        setEditMedia((prev) => prev.map((m, i) => (i === index ? { ...m, filter } : m)));
    }

    function addEditMediaField() {
        setEditMedia((prev) => [...prev, { url: "", filter: "none" }]);
    }

    function removeEditMediaField(index: number) {
        setEditMedia((prev) => prev.filter((_, i) => i !== index));
    }

    async function handleSaveEdit() {
        const cleanedMedia = editMedia.map((m) => ({ ...m, url: m.url.trim() })).filter((m) => m.url);
        const trimmedCaption = editCaption.trim();

        if (!trimmedCaption && cleanedMedia.length === 0) {
            setEditError("Write something or add a photo.");
            return;
        }

        await updatePost({
            id: post._id,
            data: {
                caption: trimmedCaption,
                media: cleanedMedia,
                type: cleanedMedia.length > 0 ? "photo" : "text",
            },
        });
        setIsEditing(false);
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
                                {isOwner && <button type="button" onClick={startEditing}>Edit</button>}
                                <button type="button" onClick={handleDelete}>Delete</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isEditing ? (
                <div className="editBox">
                    <textarea value={editCaption} onChange={(e) => setEditCaption(e.target.value)} placeholder="What's on your mind?" />

                    {editMedia.map((item, i) => (
                        <div key={i} className="mediaRow">
                            <input
                                value={item.url}
                                onChange={(e) => updateEditMediaUrl(i, e.target.value)}
                                placeholder={`Image URL ${i + 1}`}
                            />
                            <select value={item.filter} onChange={(e) => updateEditMediaFilter(i, e.target.value as MediaItem["filter"])}>
                                <option value="none">No filter</option>
                                <option value="negative">Negative</option>
                                <option value="blur">Blur</option>
                                <option value="sobel">Sobel</option>
                            </select>
                            <button type="button" onClick={() => removeEditMediaField(i)}>Remove</button>
                        </div>
                    ))}

                    <button type="button" className="addBtn" onClick={addEditMediaField}>
                        + Add a photo
                    </button>

                    {editError && <p className="editError">{editError}</p>}

                    <div className="editActions">
                        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                        <button type="button" onClick={handleSaveEdit} disabled={isSavingEdit}>Save</button>
                    </div>
                </div>
            ) : (
                <p className="postCaption"><HashtagText text={post.caption} /></p>
            )}

            {!isEditing && post.type === "photo" && post.media?.length > 0 && (
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

            <span className="chatTime">{formatTime(post.createdAt)}</span>

            {showComments && (
                <div className="commentSection">
                    {comments?.map((c) => (
                        <div key={c._id} className="comment">

                            <Link to={`/profile/${c.authorId._id}`} className="postAuthorLink">
                                <span className="commentAuthor">{c.authorId.username}</span> {c.text}
                            </Link>

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