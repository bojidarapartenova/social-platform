export interface IFilterStrategy {
    name: "none" | "negative" | "blur" | "sobel";
    apply(ctx: CanvasRenderingContext2D): void;
}