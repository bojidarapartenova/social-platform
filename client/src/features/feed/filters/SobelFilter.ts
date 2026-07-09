import type { IFilterStrategy } from "./filterStrategy";

export const SobelFilter: IFilterStrategy = {

    name: "sobel",

    apply(ctx) {

        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        const gray = new Uint8Array(width * height);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {

                const idx = (y * width + x) * 4;

                gray[y * width + x] =
                    0.299 * data[idx] +
                    0.587 * data[idx + 1] +
                    0.114 * data[idx + 2];
            }
        }

        const gx = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ];

        const gy = [
            [-1, -2, -1],
            [0, 0, 0],
            [1, 2, 1]
        ];

        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {

                let sumX = 0;
                let sumY = 0;

                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {

                        const value =
                            gray[(y + ky) * width + (x + kx)];

                        sumX += value * gx[ky + 1][kx + 1];
                        sumY += value * gy[ky + 1][kx + 1];
                    }
                }

                let magnitude = Math.sqrt(sumX * sumX + sumY * sumY);

                magnitude = Math.min(255, magnitude);

                const idx = (y * width + x) * 4;

                data[idx] = magnitude;
                data[idx + 1] = magnitude;
                data[idx + 2] = magnitude;
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }
};