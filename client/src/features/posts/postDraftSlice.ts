import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type FilterName = "none" | "negative" | "blur" | "sobel";

export interface MediaItem {
    url: string;
    filter: FilterName;
}

export interface PostDraftState {
    caption: string;
    media: MediaItem[];
    editingIndex: number | null;
    editingPostId: string | null;
}

const initialState: PostDraftState = {
    caption: "",
    media: [],
    editingIndex: null,
    editingPostId: null,
};

const postDraftSlice = createSlice({
    name: "postDraft",
    initialState,
    reducers: {
        setCaption(state, action: PayloadAction<string>) {
            state.caption = action.payload;
        },
        setMediaUrlAt(state, action: PayloadAction<{ index: number; value: string }>) {
            state.media[action.payload.index].url = action.payload.value;
        },
        setMediaFilterAt(state, action: PayloadAction<{ index: number; filter: FilterName }>) {
            state.media[action.payload.index].filter = action.payload.filter;
        },
        addMediaField(state) {
            state.media.push({ url: "", filter: "none" });
        },
        removeMediaAt(state, action: PayloadAction<number>) {
            state.media.splice(action.payload, 1);
        },
        setEditingIndex(state, action: PayloadAction<number | null>) {
            state.editingIndex = action.payload;
        },
        loadPostForEdit(
            state,
            action: PayloadAction<{
                _id: string;
                caption: string;
                media?: MediaItem[];
            }>
        ) {
            state.editingPostId = action.payload._id;
            state.caption = action.payload.caption || "";
            state.media = action.payload.media ? action.payload.media.map(m => ({ ...m })) : [];
            state.editingIndex = null;
        },
        resetDraft() {
            return initialState;
        },
    },
});

export const {
    setCaption,
    setMediaUrlAt,
    setMediaFilterAt,
    addMediaField,
    removeMediaAt,
    setEditingIndex,
    loadPostForEdit,
    resetDraft,
} = postDraftSlice.actions;

export default postDraftSlice.reducer;