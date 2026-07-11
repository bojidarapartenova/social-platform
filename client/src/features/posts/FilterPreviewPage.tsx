import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { setMediaFilterAt, setEditingIndex } from "./postDraftSlice";
import type { FilterName } from "./postDraftSlice";
import { FilteredImage } from "../feed/FilteredImage";
import "../../styles/filterPreview.css";

const FILTER_OPTIONS: FilterName[] = ["none", "negative", "blur", "sobel"];

export function FilterPreviewPage() {
    const draft = useSelector((state: RootState) => state.postDraft);
    const index = draft.editingIndex;
    const item = index !== null ? draft.media[index] : null;

    const [tempFilter, setTempFilter] = useState<FilterName>(item?.filter ?? "none");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function goBack() {
        dispatch(setEditingIndex(null));
        navigate("/create");
    }

    function handleApply() {
        if (index !== null) dispatch(setMediaFilterAt({ index, filter: tempFilter }));
        goBack();
    }

    if (!item || !item.url.trim()) {
        return (
            <div className="filterPage">
                <div className="filterCard">
                    <p>Add an image URL first, then choose a filter for it.</p>
                    <button type="button" className="cancelBtn" onClick={goBack}>Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="filterPage">
            <div className="filterCard">
                <h1>Choose a filter</h1>

                <div className="previewScroll">
                    <FilteredImage src={item.url} filter={tempFilter} />
                </div>

                <div className="filterOptions">
                    {FILTER_OPTIONS.map((f) => (
                        <button
                            key={f}
                            type="button"
                            className={tempFilter === f ? "filterBtn active" : "filterBtn"}
                            onClick={() => setTempFilter(f)}
                        >
                            {f === "none" ? "No filter" : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="actionRow">
                    <button type="button" className="cancelBtn" onClick={goBack}>Cancel</button>
                    <button type="button" className="applyBtn" onClick={handleApply}>Apply</button>
                </div>
            </div>
        </div>
    );
}