import jDataView from 'jdataview';
import axios from 'axios';
import MonotonicCubicSpline from '../jspline';

interface AllPoints {
    rgb: string[] | number[],
    r: string[] | number[],
    g: string[] | number[],
    b: string[] | number[],
}

/*
* Greatly inspired by jQuery filter.me (https://github.com/MatthewRuddy/jQuery-filter.me)
* jQuery filter.me is Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
* Copyright © 2012 Matthew Ruddy (http://matthewruddy.com).
*
*/

/*
* Reads a Photoshop .acv file (using jDataView) and returns the curve points of a polynomial
*/
const getACV = (filter: string, cb: (points: AllPoints) => void) => {
    const filterData = require('../acv/'+filter+'.acv');
    // Dataview ajax request to the .acv file
    axios.get(filterData, {
        responseType: 'arraybuffer',
    }).then((response) => {
            const points = {
                rgb: [],
                r: [],
                g: [],
                b: [],
            };
            const view = new jDataView(response.data);
            // Move internal pointer 4 positions
            // Length of ACV data before the data is 2 bytes + 2 bytes
            // Read more: https://www.adobe.com/devnet-apps/photoshop/fileformatashtml/#50577411_37810
            view.seek(4);
            const ref = ['rgb', 'r', 'g', 'b'];
            let array;
            // Now let's get the individual R, G, B curve points
            for (let i = 0; i < 4; i++) {
                // Read count of points in the curve
                const length = view.getUint16();
                array = points[ ref[ i ] ];
                for (let j = 0; j < length; j++) {
                    const y = view.getUint16();
                    const x = view.getUint16();
                    array.push([x, y]);
                }
            }
            cb(points);
        });
};

/*
* Gets the curve values for the specified set of curve points
*/
const getCurve = (curvePoints: string[] | number[]) => {
    const curve = [];
    const x = [];
    const y = [];

    // Loop through each point
    for (const point of curvePoints) {
        x.push(point[0]);
        y.push(point[1]);
    }

    // Create the cubic spline
    const cubicSpline = new MonotonicCubicSpline(x, y);

    // Interpolate values and return the curve
    for (let i = 0; i <= 256; i++) {
        curve[i] = Math.round(cubicSpline.interpolate(i)) || 0;
    }
    return curve;
};

const getLowestFromArrayAbove = (array: number[], min: number) => {
    const arrayMin = Math.min(...array);
    if (arrayMin < min) {
        return min;
    }
    return arrayMin;
};

/*
* Gets the curves values for the various RGB channels
*/
const getCurves = (allPoints: AllPoints) => {
    const curves = {
        rgb: [],
        r: [],
        g: [],
        b: [],
    };

    // Get each curve & add them to the curves array
    for (const i in allPoints) {
        if (allPoints.hasOwnProperty(i)) {
            curves[i] = getCurve(allPoints[i]);
        }
    }

    // Remove null values (usually if x start from other than 0, then look for min x value and set all x<{startValue} to startValue)
    for (const i in curves) {
        if (curves.hasOwnProperty(i)) {
            const min = getLowestFromArrayAbove(curves[i], 0) -1;
            for (let j = 0; j <= curves[ i ].length; j++) {
                if (curves[i][j] === 0) {
                    curves[i][j] = min;
                }
            }
        }
    }
    // Return the curves
    return curves;
};

export const addCurves = (canvas: HTMLCanvasElement, filter: string, cb: () => void) => {
    if (filter === 'Inkwell' || filter === 'Normal') {
        cb();
        return;
    }
    // Get the curves
    getACV(filter, (points) => {
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const curves = getCurves(points);
        // Get the canvas image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const newImageData = imageData;
        const data = newImageData.data;
        const length = data.length;

        // Apply the color R, G, B values to each individual pixel
        for (let i = 0; i < length; i += 4) {
            data[i] = curves.r[data[i]];
            data[i+1] = curves.g[data[i+1]];
            data[i+2] = curves.b[data[i+2]];
        }

        // Apply the overall RGB contrast changes to each pixel
        for (let i = 0; i < length; i += 4) {
            data[i] = curves.rgb[data[i]];
            data[i+1] = curves.rgb[data[i+1]];
            data[i+2] = curves.rgb[data[i+2]];
        }
        // Restore modified image data
        ctx.putImageData(newImageData, 0, 0);
        cb();
    });
};
