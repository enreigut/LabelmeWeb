import { useEffect, useRef, useState } from "react";
import { ImageData } from "../loader/Loader";
import { Size } from "../displayer/Displayer";

interface Point {
    x: number;
    y: number;
    scale: Size<number>;
};

interface Vector2 {
    start: Point;
    end: Point;
};

interface Polygon {
    points: Array<Point>
};

interface DataArea {
    polygon: Polygon;
    color: string;
    label: string;
}

interface ImageCanvasProps {
    parentRef: HTMLDivElement | null;
    imageData: ImageData | undefined;
}; 

const Canvas = ( props: ImageCanvasProps ) => {
    const [labelId, setLabelId] = useState<number>(0);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [cursorPos, setCursorPos] = useState<Point | undefined>(undefined); 
    
    const [imageData, setImageData] = useState<ImageData | undefined>(undefined);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    
    const [clicked, setClicked] = useState<boolean>(false);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    
    const [points, setPoints] = useState<Array<Point>>([]);
    const [dataAreas, seDataAreas] = useState<Array<DataArea>>([]);

    function calculateCentroid(points: Point[]): Point {
        let cx = 0, cy = 0, area = 0;
        const n = points.length;
      
        for (let i = 0; i < n; i++) {
            const x0 = points[i].x * canvasRef.current!.width / points[i].scale.width;
            const y0 = points[i].y * canvasRef.current!.height / points[i].scale.height;
            const x1 = points[(i + 1) % n].x * canvasRef.current!.width / points[(i + 1) % n].scale.width;
            const y1 = points[(i + 1) % n].y * canvasRef.current!.height / points[(i + 1) % n].scale.height;

            const crossProduct = x0 * y1 - x1 * y0;
            area += crossProduct;
            cx += (x0 + x1) * crossProduct;
            cy += (y0 + y1) * crossProduct;
        }
      
        area /= 2;
        cx /= 6 * area;
        cy /= 6 * area;
      
        return { x: cx, y: cy, scale: { width: canvasRef.current!.width, height: canvasRef.current!.height }};
    }

    const calculateDistanceBetweenPoints = (point1: Point, point2: Point): number => {
        const xDiff = point2.x * canvasRef.current!.width / point2.scale.width - point1.x * canvasRef.current!.width / point1.scale.width;
        const yDiff = point2.y * canvasRef.current!.height / point2.scale.height - point1.y * canvasRef.current!.height / point1.scale.height;

        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    };

    const generateRandomColor = () => {
        var o = Math.round, r = Math.random, s = 255;
        return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + 0.5 + ')';
    }

    const drawCircle = (
        ctx: CanvasRenderingContext2D, 
        point: Point,
        color: string
    ) => {
        const scale: Size<number> = {
            width: canvasRef.current!.width / point.scale.width,
            height: canvasRef.current!.height / point.scale.height,
        };

        ctx.beginPath();
        ctx.arc(point.x * scale.width, point.y * scale.height, 4, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    const drawLine = (ctx: CanvasRenderingContext2D, line: Vector2) => {
        const scaleStart: Size<number> = {
            width: canvasRef.current!.width / line.start.scale.width,
            height: canvasRef.current!.height / line.start.scale.height,
        };

        const scaleEnd: Size<number> = {
            width: canvasRef.current!.width / line.end.scale.width,
            height: canvasRef.current!.height / line.end.scale.height,
        };

        ctx.beginPath();
        ctx.moveTo(line.start.x * scaleStart.width, line.start.y * scaleStart.height);
        ctx.lineTo(line.end.x * scaleEnd.width, line.end.y * scaleEnd.height);
        ctx.stroke();
        ctx.closePath();
    }

    const drawPolygon = (ctx: CanvasRenderingContext2D, polygon: Polygon, color: string) => {
        ctx.beginPath();

        const point0 = polygon.points[0];
        ctx.moveTo(point0.x * canvasRef.current!.width / point0.scale.width, polygon.points[0].y * canvasRef.current!.height / point0.scale.height);

        polygon.points.slice(1).forEach((point, idx) => {
            ctx.lineTo(point.x * canvasRef.current!.width / point.scale.width, point.y * canvasRef.current!.height / point.scale.height);
        });
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    const drawInCanvas = (
        ctx: CanvasRenderingContext2D,
        canvasRef: HTMLCanvasElement,
        image: HTMLImageElement,
        cursorPos: Point | undefined
    ) => {
        ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
        ctx.drawImage(image, 0, 0, canvasRef.width, canvasRef.height);

        dataAreas.forEach((dataArea) => {
            drawPolygon(ctx, dataArea.polygon, dataArea.color);

            // Calculate centroid
            const centroid = calculateCentroid(dataArea.polygon.points);

            // Draw text at centroid
            ctx.font = '14px Arial';
            ctx.fillStyle = "white";
            ctx.textAlign = 'center';
            ctx.fillText(dataArea.label, centroid.x, centroid.y);
        });

        dataAreas.forEach((dataArea) => {
            dataArea.polygon.points.forEach((point, idx) => {
                drawCircle(ctx, point, "red");

                if (idx > 0) {
                    drawLine(ctx, { start: dataArea.polygon.points[idx-1], end: dataArea.polygon.points[idx]});

                    if (idx === dataArea.polygon.points.length - 1) {
                        drawLine(ctx, { start: dataArea.polygon.points[dataArea.polygon.points.length - 1], end: dataArea.polygon.points[0]});
                    }
                }
            });
        });

        points.forEach((point, idx) => {
            if (cursorPos) {
                const distance = calculateDistanceBetweenPoints(point, cursorPos);
                drawCircle(ctx, point, distance <= 10 ? "yellow" : "red");
            } else {
                drawCircle(ctx, point, "red");
            }

            if (cursorPos) {
                if (idx > 0 && idx < points.length) {
                    drawLine(ctx, { start: points[idx - 1], end: points[idx]})
                }

                if (isDrawing) {
                    drawLine(ctx, { start: points[points.length - 1], end: cursorPos!})
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
                drawInCanvas(ctx, canvasRef.current, image, cursorPos);
            }  
        }
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();

            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const cursor: Point = {
                x: mouseX,
                y: mouseY,
                scale: {
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
                    if (calculateDistanceBetweenPoints(cursor, points[0]) <= 10) {
                        pointToSet = points[0];
                    }
                }

                if (pointToSet != cursor) {
                    setIsDrawing(false);
                    const polygon: Polygon = {points: points};
                    seDataAreas([...dataAreas, {
                        polygon: polygon,
                        color: generateRandomColor(),
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
                drawInCanvas(ctx, canvasRef.current, image, cursorPos);
            }
        }        
    };

    const handleMouseUp = () => {
        setClicked(false);
    };

    useEffect(() => {
        if (canvasRef.current && image && imageData) {
            // Resize
            const aspectRatio = imageData.size.height / imageData.size.width;
            const canvasHeight = canvasRef.current.width * aspectRatio;
            canvasRef.current.height = canvasHeight;

            const ctx = canvasRef.current.getContext('2d');

            if (ctx) {
                drawInCanvas(ctx, canvasRef.current, image, cursorPos);
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

    useEffect(() => {

    }, [])

    return (
        <div style = {{ width: "100%" }}>
            <canvas 
                ref = { canvasRef } 
                onMouseDown={ handleMouseDown }
                onMouseMove={ handleMouseMove }
                onMouseUp={ handleMouseUp }
            />

            {/* <div style={{width: "100%"}}>
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
                    {JSON.stringify(polygons, null, 2)}
                </pre>
            </div> */}
        </div>
    )
}

export default Canvas;
