export const initCanvas = (src: string, callback: (canvas: HTMLCanvasElement) => void) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const image = new Image();
    // Get image src and load it
    image.src = src;

    image.onload = function(this: HTMLImageElement) {
        canvas.width = this.width;
        canvas.height = this.height;

        // Draw the image onto the canvas
        if (ctx) {
            ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas.width, canvas.height);
        }
        callback(canvas);
    };
};

export const outputUrl = (canvas: HTMLCanvasElement) => {
    return canvas.toDataURL();
};

export const scaleImage = (src: string, dimensions: any, callback: (canvas: HTMLCanvasElement) => void) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const image = new Image();
    // Get image src and load it
    image.src = src;

    image.onload = function(this: HTMLImageElement) {
        const imgAspectRatio = this.width / this.height;
        const containerAspectRatio = dimensions.containerWidth / dimensions.containerHeight;
        let xPos;
        let yPos;
        if (imgAspectRatio >= containerAspectRatio) {
            // Height smaller, set it to max
            canvas.height = this.height;
            canvas.width = this.height * containerAspectRatio;
            yPos = 0;
            const scaledXPos = (canvas.width / dimensions.containerWidth) * dimensions.xPos;
            xPos = (this.width-canvas.width)/2 - scaledXPos;
        } else {
            // Width smaller, set it to max
            canvas.width = this.width;
            canvas.height = this.width / containerAspectRatio;
            xPos = 0;
            const scaledYPos = (canvas.height / dimensions.containerHeight) * dimensions.yPos;
            yPos = (this.width-canvas.width)/2 - scaledYPos;
        }
        if (ctx) {
            ctx.drawImage(this, xPos, yPos, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        }
        callback(canvas);
    };
};
