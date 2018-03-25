import { initCanvas, scaleImage, outputUrl } from './canvas';
import { addCurves, deSaturate } from './filters';

declare var Caman: any;

export const filterImage = (src: string, filterName: string, cb: (dataUrl: string) => void) => {
    initCanvas(src, (canvas: HTMLCanvasElement) => {
        if (filterName === 'Gotham' || filterName === 'Inkwell') {
            deSaturate(canvas, 1);
        }
        addCurves(canvas, filterName, () => {
            cb(outputUrl(canvas));
        });
    });
};

export const enhanceImage = (src: string, enhancements: any, cb: (dataUrl: string) => void) => {
    initCanvas(src, (canvas: HTMLCanvasElement) => {
        Caman(canvas, function(this: any, err: any) {
            enhancements.forEach((enhancement: any) => {
                if (enhancement.value === 0) {
                    return;
                }
                if (!enhancement.range) {
                    this[enhancement.name]();
                } else {
                    const value = enhancement.valueDivider ? (enhancement.value / enhancement.valueDivider) : enhancement.value;
                    this[enhancement.name](value);
                }
            });
            this.render(() => {
                cb(outputUrl(this.canvas));
            });
        });
    });
};

export const downloadScaledImage = (src: string, dimensions: any, cb: (dataUrl: string) => void) => {
    if (dimensions) {
        scaleImage(src, dimensions, (canvas: HTMLCanvasElement) => {
            cb(outputUrl(canvas));
        });
    } else {
        initCanvas(src, (canvas: HTMLCanvasElement) => {
            cb(outputUrl(canvas));
        });
    }
};
