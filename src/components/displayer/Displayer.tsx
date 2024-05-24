import { useEffect, useRef, useState } from "react";

// Interfaces
import { ImageData } from "../../interfaces/imageData";
import { Size } from "../../interfaces/size";

// Components
import Canvas from "../Canvas/canvas";

export interface DisplayerProps {
    imageData: ImageData | undefined;
}

const Displayer = (props: DisplayerProps) => {
    const canvasParentRef = useRef<HTMLDivElement>(null);

    const [currentSize, setCurrentSize] = useState<Size<number> | undefined>(undefined);
    const [imageData, setImageData] = useState<ImageData | undefined>(undefined);

    const handleWindowResize = () => {
        if (canvasParentRef.current) {
            setCurrentSize({
                width: canvasParentRef.current.clientWidth,
                height: canvasParentRef.current.clientHeight
            });
        }
    };

    useEffect(() => {
        setImageData(props.imageData);
    }, [props])

    useEffect(() => {
        handleWindowResize();

        window.addEventListener('resize', () => {
            handleWindowResize();
        }, false);
    }, []);

    return (
        <div style = {{ width: "100%" }}>
            <div ref = { canvasParentRef } style={{ width: "100%" }}>
                <Canvas 
                    parentRef = { canvasParentRef.current } 
                    imageData = { imageData }
                />
            </div>

            <div style={{ width: "100%" }} >
                <p>{`Name: ${props.imageData?.name}`}</p>
                <p>{`Original size (width x height): ${imageData?.size.width} px, ${imageData?.size.height} px`}</p>
                <p>{`Current size (width x height): ${currentSize?.width} px, ${currentSize?.height} px`}</p>
            </div>
        </div>
    )
};

export default Displayer;
