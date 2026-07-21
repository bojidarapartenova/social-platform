import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useCreatePostMutation, useUpdatePostMutation } from "./postApiSlice";
import {
    setCaption,
    setMediaUrlAt,
    addMediaField,
    removeMediaAt,
    setEditingIndex,
    resetDraft,
} from "./postDraftSlice";
import "../../styles/postForm.css";

export function CreatePostForm() {
    const draft = useSelector((state: RootState) => state.postDraft);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
    const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
    const [formError, setFormError] = useState("");
    const [isCancelHovered, setIsCancelHovered] = useState(false);

    const isEditingMode = Boolean(draft.editingPostId);
    const isLoading = isCreating || isUpdating;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError("");

        const cleanedMedia = draft.media
            .map((m) => ({ ...m, url: m.url.trim() }))
            .filter((m) => m.url);
        const trimmedCaption = draft.caption.trim();

        if (!trimmedCaption && cleanedMedia.length === 0) {
            setFormError("Write something or add a photo.");
            return;
        }

        try {
            if (isEditingMode && draft.editingPostId) {
                await updatePost({
                    id: draft.editingPostId,
                    data: {
                        caption: trimmedCaption,
                        type: cleanedMedia.length > 0 ? "photo" : "text",
                        media: cleanedMedia.length > 0 ? cleanedMedia : undefined,
                    },
                }).unwrap();
            } else {
                await createPost({
                    type: cleanedMedia.length > 0 ? "photo" : "text",
                    caption: trimmedCaption,
                    media: cleanedMedia.length > 0 ? cleanedMedia : undefined,
                }).unwrap();
            }

            dispatch(resetDraft());
            navigate("/");
        } catch {
            setFormError(`Something went wrong ${isEditingMode ? "updating" : "creating"} your post.`);
        }
    }

    function openFilterPage(index: number) {
        dispatch(setEditingIndex(index));
        navigate("/create/filters");
    }

    function handleCancel() {
        dispatch(resetDraft());
        navigate("/");
    }

    return (
        <div className="postFormPage">
            <form className="postFormCard" onSubmit={handleSubmit}>
                <h1>{isEditingMode ? "Edit post" : "New post"}</h1>

                <textarea
                    value={draft.caption}
                    onChange={(e) => dispatch(setCaption(e.target.value))}
                    placeholder="What's on your mind?"
                />

                {draft.media.map((item, i) => (
                    <div key={i} className="mediaRow">
                        <input
                            value={item.url}
                            onChange={(e) =>
                                dispatch(setMediaUrlAt({ index: i, value: e.target.value }))
                            }
                            placeholder={`Image URL ${i + 1}`}
                        />
                        <button
                            type="button"
                            className="filterBtnSmall"
                            onClick={() => openFilterPage(i)}
                        >
                            {item.filter === "none"
                                ? "Choose filter"
                                : `Filter: ${item.filter}`}
                        </button>
                        <button
                            type="button"
                            className="removeBtn"
                            onClick={() => dispatch(removeMediaAt(i))}
                        >
                            ×
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    className="addBtn"
                    onClick={() => dispatch(addMediaField())}
                >
                    + Add a photo
                </button>

                <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                    <button type="submit" disabled={isLoading} style={{ flex: 1 }}>
                        {isEditingMode ? "Save changes" : "Post"}
                    </button>

                    {isEditingMode && (
                        <button
                            type="button"
                            className="addBtn"
                            onClick={handleCancel}
                            onMouseEnter={() => setIsCancelHovered(true)}
                            onMouseLeave={() => setIsCancelHovered(false)}
                            style={{
                                flex: 1,
                                marginTop: 0,
                                cursor: "pointer",
                                transition: "background-color 0.2s ease",
                                backgroundColor: isCancelHovered ? "#e0e0e0" : "#f0f0f0",
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>

                {formError && <p>{formError}</p>}
            </form>
        </div>
    );
}