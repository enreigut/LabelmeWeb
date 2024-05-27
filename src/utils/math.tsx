import { Point } from "../interfaces/point";
import { Size } from "../interfaces/size";

// Function that calculates the euclidean distance between 2  point
// We need to pass the canvas size since we want the points to be adjusted to current size
export const calculateDistanceBetweenPoints = (point1: Point, point2: Point, canvasSize: Size<number>): number => {
    const scaledPoint1 = calculateRelativePoint(point1, canvasSize);
    const scaledPoint2 = calculateRelativePoint(point2, canvasSize);
    
    const xDiff = scaledPoint2.x - scaledPoint1.x;
    const yDiff = scaledPoint2.y - scaledPoint1.y;

    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
};

// Function that calculates the center of mass of a set of points
// Used to put the label in the center of the polygon
// Since we want to have the coordinates relative, we need to pass the size of the canvas as a parameter
export const calculateCentroidOfPolygon = (points: Array<Point>, canvasSize: Size<number>): Point => {
    let cx = 0, cy = 0, area = 0;
    const n = points.length;
      
    for (let i = 0; i < n; i++) {
        const p0 = calculateRelativePoint(points[i], canvasSize);
        const p1 = calculateRelativePoint(points[(i + 1) % n], canvasSize);

        const crossProduct = p0.x * p1.y - p1.x * p0.y;
        area += crossProduct;
        cx += (p0.x + p1.x) * crossProduct;
        cy += (p0.y + p1.y) * crossProduct;
    }
    
    area /= 2;
    cx /= 6 * area;
    cy /= 6 * area;
      
    return { x: cx, y: cy, scale: canvasSize};
};

// Function that returns the correctly scaled point for the current canvas size
export const calculateRelativePoint = (point: Point, canvasSize: Size<number>): Point => {
    return {
        x: point.x * canvasSize.width / point.scale.width,
        y: point.y * canvasSize.height / point.scale.height,
        scale: canvasSize
    };
};
