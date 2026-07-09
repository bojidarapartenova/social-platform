import { NegativeFilter } from "./NegativeFilter";
import { BlurFilter } from "./BlurFilter";
import { SobelFilter } from "./SobelFilter";

export interface IFilterStrategy {
    name: "none" | "negative" | "blur" | "sobel";
    apply(ctx: CanvasRenderingContext2D): void;
}

export const NoneFilter: IFilterStrategy = {
    name: "none",
    apply() { },
};

export function getFilterStrategy(name: string): IFilterStrategy {
    switch (name) {
        case "negative": return NegativeFilter;
        case "blur": return BlurFilter;
        case "sobel": return SobelFilter;
        default: return NoneFilter;
    }
}