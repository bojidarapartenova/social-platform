import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { RootState } from "../../app/store";
import { FilteredImage } from "../feed/FilteredImage";
import {
    useToggleLikeMutation,
    useGetCommentsQuery,
    useAddCommentMutation,
    useDeletePostMutation,
    useToggleFavoriteMutation,
    useDeleteCommentMutation,
} from "./postApiSlice";
import type { Post } from "./postApiSlice";
import { loadPostForEdit } from "./postDraftSlice";

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

export function PostCard({ post }: { post: Post }) {
    const currentUserId = useSelector((state: RootState) => state.auth.user?._id);
    const isOwner = currentUserId === post.authorId._id;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [toggleLike] = useToggleLikeMutation();
    const [showComments, setShowComments] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const [deletePost] = useDeletePostMutation();

    const { data: comments } = useGetCommentsQuery(post._id, { skip: !showComments });
    const [commentText, setCommentText] = useState("");
    const [addComment] = useAddCommentMutation();
    const [toggleFavorite] = useToggleFavoriteMutation();
    const [deleteComment] = useDeleteCommentMutation();

    function handleEdit() {
        dispatch(loadPostForEdit({
            _id: post._id,
            caption: post.caption,
            media: post.media,
        }));
        setShowMenu(false);
        navigate("/create");
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

                {isOwner && (
                    <div className="postMenu">
                        <button type="button" className="menuBtn" onClick={() => setShowMenu((v) => !v)}>...</button>
                        {showMenu && (
                            <div className="menuDropdown">
                                <button type="button" onClick={handleEdit}>Edit</button>
                                <button type="button" onClick={handleDelete}>Delete</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <p className="postCaption">{post.caption}</p>

            {post.type === "photo" && post.media && post.media.length > 0 && (
                <div className="mediaScroll">
                    {post.media.map((item, i) => (
                        <FilteredImage key={i} src={item.url} filter={item.filter} />
                    ))}
                </div>
            )}

            <div className="postActions">
                <button type="button" className={post.likedByMe ? "actionBtn liked" : "actionBtn"} onClick={() => toggleLike(post._id)}>
                    <HeartIcon filled={post.likedByMe} /> {post.likeCount}
                </button>
                <button type="button" className="actionBtn" onClick={() => setShowComments((v) => !v)}>
                    <CommentIcon /> {post.commentCount}
                </button>
                <button type="button" className={post.favoritedByMe ? "actionBtn favorited" : "actionBtn"} onClick={() => toggleFavorite(post._id)}>
                    <BookmarkIcon filled={post.favoritedByMe} />
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