import { DataArea } from "../interfaces/dataArea";
import { Point } from "../interfaces/point";
import { Polygon } from "../interfaces/polygon";
import { ReservedKeyword, ReservedKeywordConfiguration } from "../interfaces/reservedKeyword";
import { Size } from "../interfaces/size";
import { Vector2 } from "../interfaces/vector2";

import { calculateRelativePoint } from "./math";

// Function that generates a random rgb(a) color, a being opacity is set manually
export const generateRandomColor = (opacity: number): string => {
    const o = Math.round, r = Math.random, s = 255;
    return `rgba(${o(r()*s)}, ${o(r()*s)}, ${o(r()*s)}, ${opacity})`; 
};

// Functon that extracts the color components of a string in rgba format
export const getColorFromString = (color: string): Array<string> => {
    return color.replace("rgba(", "").replace(")", "").split(",");
};

// Functon that lets you build a color from its components
export const buildColorFromColorComponents = (rgba: Array<string>) => {
    return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`; 
};

// Functon that allows to change the opacity of a given color
export const changeOpcaityFromColor = (rgba: string, opacity: number): string => {
    const components = getColorFromString(rgba);
    return `rgba(${components[0]}, ${components[1]}, ${components[2]}, ${opacity})`; 
};

// Function to draw a circle on a canvas
// Defaulting circle size, it can always be parametrized to change size
// We need canvasSize since we need relative points
export const drawCircle = (
    ctx: CanvasRenderingContext2D, 
    point: Point,
    color: string,
    canvasSize: Size<number>
) => {
    const scaledPoint = calculateRelativePoint(point, canvasSize);

    ctx.beginPath();
    // x coord, y coord, radius, start angle, end angle
    ctx.arc(scaledPoint.x, scaledPoint.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.fill();
    // Comment this if we do not want the circle stroke and just a red point, no outline
    ctx.stroke();
    ctx.fillStyle = "black"; // reset to default
    ctx.strokeStyle = "black"; // reset to default
    ctx.closePath();
};

// Function to draw a line on canvas
// We need canvasSize since we need relative points
export const drawLine = (ctx: CanvasRenderingContext2D, line: Vector2, color: string, canvasSize: Size<number>) => {
    const scaledStartPoint = calculateRelativePoint(line.start, canvasSize);
    const scaledEndPoint = calculateRelativePoint(line.end, canvasSize);

    ctx.beginPath();
    ctx.moveTo(scaledStartPoint.x, scaledStartPoint.y);
    ctx.lineTo(scaledEndPoint.x, scaledEndPoint.y);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.strokeStyle = "black"; // reset to default 
    ctx.closePath();
};

// Function to draw a set of points that conform a polygon
// This only draws polygon fill, no points or lines
// We need canvasSize since we need relative points
export const drawPolygon = (ctx: CanvasRenderingContext2D, polygon: Polygon, color: string, canvasSize: Size<number>) => {
    // We need this first point to be separated since we need to move the ctx to where we need to start to draw
    ctx.beginPath();
    const scaledPoint0 = calculateRelativePoint(polygon.points[0], canvasSize);
    ctx.moveTo(scaledPoint0.x, scaledPoint0.y);

    // Then iterate over the reamining ponts as lines with 0 stroke width
    polygon.points.slice(1).forEach((point) => {
        const scaledPoint = calculateRelativePoint(point, canvasSize);
        ctx.lineTo(scaledPoint.x, scaledPoint.y);
    });

    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
};

// Function to draw the points and lines that conform the polygon sides and vertices
// We need canvasSize since we need relative points
// By default color of the vertices is red and line strokes are black
export const drawPolygonControls = (ctx: CanvasRenderingContext2D, polygon: Polygon, color: string, canvasSize: Size<number>) => {
    const rgba: Array<string> = getColorFromString(color);
    const pointColor: string = buildColorFromColorComponents([rgba[0], rgba[1], rgba[2], "0.7"]);
    const lineColor: string = buildColorFromColorComponents([rgba[0], rgba[1], rgba[2], "1"]);

    polygon.points.forEach((point, idx) => {
        // We draw all vertices
        drawCircle(ctx, point, pointColor, canvasSize);

        // We draw the lines to the points
        if (idx > 0) {
            drawLine(
                ctx, 
                { 
                    start: polygon.points[idx-1], 
                    end: polygon.points[idx]
                },
                lineColor,
                canvasSize
            );
        }

        // Since last point would be duplicated if we deciede to add in the same position as the first one
        // We just make the line to loop back to the first vertex
        if (idx === polygon.points.length - 1) {
            drawLine(
                ctx, 
                { 
                    start: polygon.points[polygon.points.length - 1], 
                    end: polygon.points[0]
                },
                lineColor,
                canvasSize 
            );
        }
    });
};

// Functon to draw text. We still need canvasSize to make it relative
// font size is in px
export const drawText = (ctx: CanvasRenderingContext2D, text: string, point: Point, fontSize: number, font: string, color: string, canvasSize: Size<number>) => {
    const scaledPoint = calculateRelativePoint(point, canvasSize)

    ctx.font = `${fontSize}px ${font}`;
    ctx.fillStyle = `${color}`;
    ctx.textAlign = 'center';
    ctx.fillText(text, scaledPoint.x, scaledPoint.y);
};

// Function that checks if polygon must override default config by reserverd keyword configuration
export const hasOverridingConfig = (dataArea: DataArea, configuration: ReservedKeyword): boolean => {
    return Object.keys(configuration).includes(dataArea.label);
}

// Function that coverrides default config by given configuration
// For the time being is just the color
export const overrideDefaultConfigWithReservedKeywordConfig = (dataArea: DataArea, configuration: ReservedKeyword) => {
    if (hasOverridingConfig(dataArea, configuration)) {
        dataArea.color = configuration[dataArea.label].polygonColor;
    }
};

export const getOverridingConfiguration = (dataArea: DataArea, configuration: ReservedKeyword): ReservedKeywordConfiguration | undefined => {
    if (hasOverridingConfig(dataArea, configuration)) {
       return configuration[dataArea.label];
    } else {
        return undefined;
    }
};
