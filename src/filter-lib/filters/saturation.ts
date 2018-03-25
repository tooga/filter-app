export const deSaturate = (canvas: HTMLCanvasElement, saturation: number) => {
    // Saturation fallback
    saturation = saturation || 1;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newImageData = imageData;
    const data = newImageData.data;
    const length = data.length;

    // Apply the desaturation
    for (let i = 0; i < length; i += 4) {
        const average = (data[i] + data[i+1] + data[i+2]) / 3;
        data[i] += (Math.round(average - data[i] * saturation));
        data[i+1] += (Math.round(average - data[i+1] * saturation));
        data[i+2] += (Math.round(average - data[i+2] * saturation));
    }

    ctx.putImageData(newImageData, 0, 0);
};
