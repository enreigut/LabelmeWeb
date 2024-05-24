import { useEffect, useRef, useState } from "react";

import { calculateCentroidOfPolygon, calculateDistanceBetweenPoints } from "../../utils/math";

import { Point } from "../../interfaces/point";
import { DataArea } from "../../interfaces/dataArea";
import { Polygon } from "../../interfaces/polygon";
import { ImageData } from "../../interfaces/imageData";
import { drawCircle, drawLine, drawPolygon, drawPolygonControls, drawText, generateRandomColor } from "../../utils/draw";
import { Size } from "../../interfaces/size";

interface ImageCanvasProps {
    parentRef: HTMLDivElement | null;
    imageData: ImageData | undefined;
}; 

const Canvas = ( props: ImageCanvasProps ) => {
    // References    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // States
    // Counter to set automatic labels
    const [labelId, setLabelId] = useState<number>(0);
    const [cursorPos, setCursorPos] = useState<Point | undefined>(undefined); 
    
    const [imageData, setImageData] = useState<ImageData | undefined>(undefined);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    
    const [clicked, setClicked] = useState<boolean>(false);
    // Modes
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    
    const [points, setPoints] = useState<Array<Point>>([]);
    const [dataAreas, seDataAreas] = useState<Array<DataArea>>([]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();

            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const cursor: Point = {x: mouseX, y: mouseY, scale: {
                    width: canvasRef.current.width,
                    height: canvasRef.current.height
                }
            };

            if (!isDrawing) {
                setIsDrawing(true);
            }

            if (!clicked) {
                setClicked(true);

                let pointToSet: Point = cursor;

                if (points.length >= 1) {
                    if (calculateDistanceBetweenPoints(cursor, points[0], {width: canvasRef.current.width, height: canvasRef.current.height}) <= 10) {
                        pointToSet = points[0];
                    }
                }

                if (pointToSet !== cursor) {
                    setIsDrawing(false);
                    const polygon: Polygon = {points: points};
                    seDataAreas([...dataAreas, {
                        polygon: polygon,
                        color: generateRandomColor(0.5),
                        label: `${labelId}`
                    }]);
                    setLabelId(labelId + 1);
                    setPoints([]);
                } else {
                    setPoints([...points, pointToSet]);
                }

            }
        }        
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (canvasRef.current && image) {
            const rect = canvasRef.current.getBoundingClientRect();

            const endX = e.clientX - rect.left;
            const endY = e.clientY - rect.top;

            setCursorPos({
                x: endX, 
                y: endY, 
                scale: {
                    width: canvasRef.current.width,
                    height: canvasRef.current.height
                }
            });

            const ctx = canvasRef.current.getContext('2d');

            if (ctx) {
                drawInCanvas(ctx, canvasRef.current, image);
            }
        }        
    };

    const handleMouseUp = () => {
        setClicked(false);
    };
    
    // Function that renders what should be seen in the canvas
    const drawInCanvas = (
        ctx: CanvasRenderingContext2D,
        canvasRef: HTMLCanvasElement,
        image: HTMLImageElement
    ) => {
        const canvasSize: Size<number> = {
            width: canvasRef.width,
            height: canvasRef.height
        };
        ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
        ctx.drawImage(image, 0, 0, canvasRef.width, canvasRef.height);

        // Draw first polygons that have been arleady set
        dataAreas.forEach((dataArea) => {
            drawPolygon(ctx, dataArea.polygon, dataArea.color, canvasRef);

            // Calculate centroid for setting the label id
            const centroid = calculateCentroidOfPolygon(
                dataArea.polygon.points, 
                {
                    width: canvasRef.width,
                    height: canvasRef.height
                }
            );

            // Draw text at centroid
            drawText(ctx, dataArea.label, centroid, 16, "Arial", "white", canvasSize);

            // Draw the polygon controls
            drawPolygonControls(ctx, dataArea.polygon, canvasSize);
        });

        // Draw current drawing which is stored in points state
        if (isDrawing) {
            draw(ctx, canvasRef, points);
        }
    }

    // Functon that display what is being currently drawn
    const draw = (
        ctx: CanvasRenderingContext2D,
        canvasRef: HTMLCanvasElement,
        points: Array<Point>
    ) => {
        const canvasSize: Size<number> = {
            width: canvasRef.width,
            height: canvasRef.height
        };
        points.forEach((point, idx) => {
            // If cursor is close to X threshold, render point differently to tell user that the loop will close and make a polygon on that point
            // Logic is limited to allow only frist point to be the one that can close the polygon
            // Also, I want to avoid user setting points to close to each other, so not allowing to put a point next to X distance of another point
            // that is not the first one
            if (cursorPos) {
                // Render vertices
                const distanceFromCursorToPoint = calculateDistanceBetweenPoints(point, cursorPos, {width: canvasRef.width, height: canvasRef.height });
                if (idx === 0 && distanceFromCursorToPoint <= 10) {
                    drawCircle(ctx, point, "yellow", canvasSize);
                } else {
                    drawCircle(ctx, point, "red", canvasSize);
                }

                // Render lines
                // If we are not in the last point, we draw the line from point to point
                // If not we render from point to cursor
                if (idx > 0 && idx < points.length) {
                    drawLine(ctx, { start: points[idx - 1], end: points[idx]}, canvasSize)
                } else {
                    drawLine(ctx, { start: points[points.length - 1], end: cursorPos}, canvasSize)
                }
            }
        });
    }

    const handleCanvasUpdate = () => {
        if (canvasRef.current && image && imageData) {
            // Resize
            const aspectRatio = imageData.size.height / imageData.size.width;
            const canvasHeight = canvasRef.current.width * aspectRatio;
            canvasRef.current.height = canvasHeight;

            const ctx = canvasRef.current.getContext('2d');

            if (ctx) {
                drawInCanvas(ctx, canvasRef.current, image);
            }  
        }
    }

    useEffect(() => {
        if (canvasRef.current && image && imageData) {
            // Resize
            const aspectRatio = imageData.size.height / imageData.size.width;
            const canvasHeight = canvasRef.current.width * aspectRatio;
            canvasRef.current.height = canvasHeight;

            const ctx = canvasRef.current.getContext('2d');

            if (ctx) {
                drawInCanvas(ctx, canvasRef.current, image);
            }
        }   
    }, [points, props])

    useEffect(() => {
        handleCanvasUpdate();
    }, [image])

    useEffect(() => {
        if (imageData) {
            const img = new Image();
            img.src = imageData.urlResource;
            setImage(img);
        }
    }, [imageData]);

    useEffect(() => {
        setImageData(props.imageData);

        if (canvasRef.current) {
            if (props.parentRef) {
                canvasRef.current.width = props.parentRef.clientWidth;
            }

            if (image && imageData) {
                handleCanvasUpdate();
            }
        }
    }, [props])

    return (
        <div style = {{ width: "100%" }}>
            <canvas 
                ref = { canvasRef } 
                onMouseDown={ handleMouseDown }
                onMouseMove={ handleMouseMove }
                onMouseUp={ handleMouseUp }
            />

            <div style={{width: "100%"}}>
                <pre 
                    style={{ 
                        background: '#f6f8fa', 
                        padding: '10px', 
                        borderRadius: '5px', 
                        whiteSpace: 'pre-wrap', 
                        wordWrap: 'break-word',
                        border: '1px solid #ddd',
                        fontFamily: 'Courier, monospace',
                        fontSize: '10px'
                    }}
                >
                    {JSON.stringify(dataAreas, null, 2)}
                </pre>
            </div>
        </div>
    )
}

export default Canvas;
