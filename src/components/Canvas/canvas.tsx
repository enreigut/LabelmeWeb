import { useEffect, useRef, useState } from "react";

import { calculateCentroidOfPolygon, calculateDistanceBetweenPoints } from "../../utils/math";
import { drawCircle, drawLine, drawPolygon, drawPolygonControls, drawText, generateRandomColor } from "../../utils/draw";
import {v4 as uuidv4} from 'uuid'

import { Point } from "../../interfaces/point";
import { DataArea } from "../../interfaces/dataArea";
import { Polygon } from "../../interfaces/polygon";
import { ImageData } from "../../interfaces/imageData";
import { Size } from "../../interfaces/size";

interface ImageCanvasProps {
    imageData: ImageData | undefined;
    dataAreas: Array<DataArea>;
    editedDataArea: DataArea | undefined;
    sendDataArea: (dataAreas: Array<DataArea>) => void;
    handleCanvasSize: (canvasSize: Size<number>) => void;
    handleMode: (mode: string) => void;
}; 

const Canvas = ( props: ImageCanvasProps ) => {
    // Configuration
    const minDistanceFromPointToMergeInPx: number = 10;

    // References
    const parentRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // States
    // Counter to set automatic labels
    const [labelId, setLabelId] = useState<number>(0);
    
    const [currentSize, setCurrentSize] = useState<Size<number> | undefined>(undefined);
    const [cursorPos, setCursorPos] = useState<Point | undefined>(undefined); 
    const [imageData, setImageData] = useState<ImageData | undefined>(undefined);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    
    const [clicked, setClicked] = useState<boolean>(false);
    // Modes
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [draggingIndex, setDraggingIndex] = useState<number | undefined>(undefined);
    
    const [points, setPoints] = useState<Array<Point>>([]);
    // const [dataAreas, setDataAreas] = useState<Array<DataArea>>([]);

    const handleCanvasSize = () => {
        if (canvasRef.current) {
            props.handleCanvasSize({
                width: canvasRef.current.width,
                height: canvasRef.current.height,
            });   
        }
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if(e.button === 0) {
            if (canvasRef.current) {
                const rect = canvasRef.current.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                const canvasSize = {width: canvasRef.current.width, height: canvasRef.current.height};

                const cursor: Point = {x: mouseX, y: mouseY, scale: {
                        width: canvasRef.current.width,
                        height: canvasRef.current.height
                    }
                };
    
                if (!isDrawing) {
                    if (!isEditing) {
                        setIsDrawing(true);
                        props.handleMode("Drawing");
                    }
                }
    
                if (!clicked && !isEditing) {
                    setClicked(true);
    
                    let pointToSet: Point = cursor;
    
                    // Bigger than 2 since we only want to close polygon not lines
                    // We can do some more complex logic here to see if:
                    //  - The points have similar slope meaning they are in a straightline (we want to not allow this I guess)
                    if (points.length >= 2) {
                        if (calculateDistanceBetweenPoints(cursor, points[0], canvasSize) <= minDistanceFromPointToMergeInPx) {
                            pointToSet = points[0];
                        }
                    }
    
                    // If the pointToSet is different to the cursor one (point in the pos when the click event happened), 
                    // meaning, we are entering condition from above, means we did close the polygon
                    if (pointToSet !== cursor) {
                        setIsDrawing(false);
                        props.handleMode("Waiting");

                        const polygon: Polygon = {points: points};
                        props.sendDataArea([...props.dataAreas, {
                            id: uuidv4(),
                            label: `${labelId}`,
                            color: generateRandomColor(0.5),
                            polygon: polygon
                        }]);
                        setLabelId(labelId + 1);
                        setPoints([]);
                    } else {
                        // If the point is further away enough from previous poinyt we set it, if not, nope
                        if (points.length > 0) {
                            if (calculateDistanceBetweenPoints(points[points.length - 1], pointToSet, canvasSize) > minDistanceFromPointToMergeInPx) {
                                setPoints([...points, pointToSet]);
                            }
                        } else {
                            setPoints([...points, pointToSet]);
                        }
                    }
                } else if (isEditing && !clicked) {
                    setClicked(true);
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
        setIsDragging(false);
        setDraggingIndex(undefined);
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
        props.dataAreas.forEach((dataArea) => {
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
            drawPolygonControls(ctx, dataArea.polygon, dataArea.color, canvasSize);
        });

        // Draw current drawing which is stored in points state
        if (isDrawing) {
            draw(ctx, canvasRef, points);
        } else if (isEditing) {
            if (props.editedDataArea) {
                drawEditingDataArea(ctx, canvasRef, props.editedDataArea);
            }
        }
    }

    // Function that display what is being currently drawn
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
                    drawLine(ctx, { start: points[idx - 1], end: points[idx]}, "black", canvasSize)
                } else {
                    drawLine(ctx, { start: points[points.length - 1], end: cursorPos}, "black", canvasSize)
                }
            }
        });
    }

    const drawEditingDataArea = (
        ctx: CanvasRenderingContext2D,
        canvasRef: HTMLCanvasElement,
        dataArea: DataArea
    ) => {
        const canvasSize: Size<number> = {
            width: canvasRef.width,
            height: canvasRef.height
        };
        
        dataArea.polygon.points.forEach((point, idx) => {
            // If cursor is close to X threshold, render point differently to tell user that the loop will close and make a polygon on that point
            // Logic is limited to allow only frist point to be the one that can close the polygon
            // Also, I want to avoid user setting points to close to each other, so not allowing to put a point next to X distance of another point
            // that is not the first one
            if (cursorPos) {
                // Render vertices
                const distanceFromCursorToPoint = calculateDistanceBetweenPoints(point, cursorPos, {width: canvasRef.width, height: canvasRef.height });
                if (distanceFromCursorToPoint <= 10 && clicked && !isDragging) {
                    setIsDragging(true);
                    setDraggingIndex(idx);
                } else if (distanceFromCursorToPoint <= 10) {
                    drawCircle(ctx, point, "yellow", canvasSize);
                } else {
                    drawCircle(ctx, point, "red", canvasSize);
                }

                if (isDragging) {
                    if (draggingIndex === idx) {
                        dataArea.polygon.points[draggingIndex] = cursorPos;
                        drawCircle(ctx, point, "yellow", canvasSize);
                    } else {
                        drawCircle(ctx, point, "red", canvasSize);
                    }
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

            handleCanvasSize();

            const ctx = canvasRef.current.getContext('2d');

            if (ctx) {
                drawInCanvas(ctx, canvasRef.current, image);
            }  
        }
    }

    const handleWindowResize = () => {
        if (parentRef.current) {
            setCurrentSize({
                width: parentRef.current.clientWidth,
                height: parentRef.current.clientHeight
            });
        }
    };

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
        
        // If image changes, we need to clean everything
        setLabelId(0);
        props.sendDataArea([]);
        setPoints([]);

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

        if (props.editedDataArea) {
            setIsDrawing(false);
            setIsEditing(true);
        } else {
            setIsEditing(false);
        }
    }, [props]);

    useEffect(() => {
        if (parentRef.current) {
            if (canvasRef.current) {
                if (currentSize) {
                    canvasRef.current.width = currentSize.width;
                }
                
                if (image && imageData) {
                    handleCanvasUpdate();
                }
            }
        }
    }, [currentSize])

    useEffect(() => {
        handleWindowResize();

        window.addEventListener("resize", handleWindowResize, false);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        }
    }, []);

    return (
        <div ref = { parentRef }>
            <canvas 
                ref = { canvasRef } 
                onMouseDown={ handleMouseDown }
                onMouseMove={ handleMouseMove }
                onMouseUp={ handleMouseUp }
            />
        </div>
    )
}

export default Canvas;
