import type { IFilterStrategy } from "./filterStrategy";

export const NegativeFilter: IFilterStrategy = {
    name: "negative",

    apply(ctx) {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i + 1] = 255 - data[i + 1];
            data[i + 2] = 255 - data[i + 2];
        }

        ctx.putImageData(imageData, 0, 0);
    }
}