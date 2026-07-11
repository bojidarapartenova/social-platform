import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type FilterName = "none" | "negative" | "blur" | "sobel";

export interface MediaItem {
    url: string;
    filter: FilterName;
}

interface PostDraftState {
    type: "text" | "photo";
    caption: string;
    media: MediaItem[];
    editingIndex: number | null;
}

const initialState: PostDraftState = {
    type: "text",
    caption: "",
    media: [{ url: "", filter: "none" }],
    editingIndex: null,
};

const postDraftSlice = createSlice({
    name: "postDraft",
    initialState,
    reducers: {
        setType(state, action: PayloadAction<"text" | "photo">) {
            state.type = action.payload;
        },
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
        resetDraft() {
            return initialState;
        },
    },
});

export const {
    setType, setCaption, setMediaUrlAt, setMediaFilterAt,
    addMediaField, removeMediaAt, setEditingIndex, resetDraft,
} = postDraftSlice.actions;

export default postDraftSlice.reducer;