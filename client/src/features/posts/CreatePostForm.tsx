import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useCreatePostMutation, useUpdatePostMutation } from "./postApiSlice";
import { setCaption, setMediaUrlAt, addMediaField, removeMediaAt, setEditingIndex, setGroupId, resetDraft } from "./postDraftSlice";
import { useGetGroupQuery } from "../groups/groupApiSlice";
import "../../styles/postForm.css";

export function CreatePostForm() {
    const draft = useSelector((state: RootState) => state.postDraft);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
    const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
    const [formError, setFormError] = useState("");

    const isEditMode = !!draft.editingPostId;
    const isSubmitting = isEditMode ? isUpdating : isCreating;

    useEffect(() => {
        if (isEditMode) return;
        const groupParam = searchParams.get("group");
        if (groupParam) dispatch(setGroupId(groupParam));
    }, [searchParams, isEditMode]);

    const { data: groupInfo } = useGetGroupQuery(draft.groupId!, { skip: !draft.groupId });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError("");

        const cleanedMedia = draft.media.map((m) => ({ ...m, url: m.url.trim() })).filter((m) => m.url);
        const trimmedCaption = draft.caption.trim();

        if (!trimmedCaption && cleanedMedia.length === 0) {
            setFormError("Write something or add a photo.");
            return;
        }

        try {
            if (isEditMode) {
                await updatePost({
                    id: draft.editingPostId!,
                    data: {
                        caption: trimmedCaption,
                        media: cleanedMedia,
                        type: cleanedMedia.length > 0 ? "photo" : "text",
                    },
                }).unwrap();
            } else {
                await createPost({
                    type: cleanedMedia.length > 0 ? "photo" : "text",
                    caption: trimmedCaption,
                    media: cleanedMedia.length > 0 ? cleanedMedia : undefined,
                    groupId: draft.groupId ?? undefined,
                }).unwrap();
            }
            const targetGroupId = draft.groupId;
            dispatch(resetDraft());
            navigate(targetGroupId ? `/groups/${targetGroupId}` : "/");
        } catch {
            setFormError(isEditMode ? "Something went wrong updating your post." : "Something went wrong creating your post.");
        }
    }

    function openFilterPage(index: number) {
        dispatch(setEditingIndex(index));
        navigate("/create/filters");
    }

    function handleCancel() {
        dispatch(resetDraft());
        navigate(-1);
    }

    return (
        <div className="postFormPage">
            <form className="postFormCard" onSubmit={handleSubmit}>
                <h1>{isEditMode ? "Edit post" : "New post"}</h1>

                {groupInfo && !isEditMode && <p className="groupPostBanner">Posting in <strong>{groupInfo.name}</strong></p>}

                <textarea
                    value={draft.caption}
                    onChange={(e) => dispatch(setCaption(e.target.value))}
                    placeholder="What's on your mind?"
                />

                {draft.media.map((item, i) => (
                    <div key={i} className="mediaRow">
                        <input
                            value={item.url}
                            onChange={(e) => dispatch(setMediaUrlAt({ index: i, value: e.target.value }))}
                            placeholder={`Image URL ${i + 1}`}
                        />
                        <button type="button" className="filterBtnSmall" onClick={() => openFilterPage(i)}>
                            {item.filter === "none" ? "Choose filter" : `Filter: ${item.filter}`}
                        </button>
                        <button type="button" onClick={() => dispatch(removeMediaAt(i))}>Remove</button>
                    </div>
                ))}

                <button type="button" className="addBtn" onClick={() => dispatch(addMediaField())}>
                    + Add a photo
                </button>

                <div className="postFormActions">
                    {isEditMode && <button type="button" className="cancelEditBtn" onClick={handleCancel}>Cancel</button>}
                    <button type="submit" disabled={isSubmitting}>{isEditMode ? "Save" : "Post"}</button>
                </div>

                {formError && <p>{formError}</p>}
            </form>
        </div>
    );
}