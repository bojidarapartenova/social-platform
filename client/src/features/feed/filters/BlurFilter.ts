import type { IFilterStrategy } from "./filterStrategy";

export const BlurFilter: IFilterStrategy = {
    name: "blur",

    apply(ctx) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        const copy = new Uint8ClampedArray(data);

        const kernel = [
            [0.0625, 0.125, 0.0625],
            [0.125, 0.25, 0.125],
            [0.0625, 0.125, 0.0625]
        ];

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {

                let r = 0;
                let g = 0;
                let b = 0;

                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {

                        const idx = ((y + ky) * width + (x + kx)) * 4;
                        const weight = kernel[ky + 1][kx + 1];

                        r += copy[idx] * weight;
                        g += copy[idx + 1] * weight;
                        b += copy[idx + 2] * weight;
                    }
                }

                const idx = (y * width + x) * 4;

                data[idx] = Math.round(r);
                data[idx + 1] = Math.round(g);
                data[idx + 2] = Math.round(b);
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }
};