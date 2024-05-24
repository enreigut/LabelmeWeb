import { useEffect, useRef, useState } from "react";

// Interfaces
import { ImageData } from "../../interfaces/imageData";
import { Size } from "../../interfaces/size";

// Components
import Canvas from "../Canvas/canvas";
import { DataArea } from "../../interfaces/dataArea";
import DataAreaInfo from "../DataAreaInfo/dataAreaInfo";

export interface DisplayerProps {
    imageData: ImageData | undefined;
}

const Displayer = (props: DisplayerProps) => {
    const canvasParentRef = useRef<HTMLDivElement>(null);

    const [currentSize, setCurrentSize] = useState<Size<number> | undefined>(undefined);
    const [imageData, setImageData] = useState<ImageData | undefined>(undefined);
    const [dataAreas, setDataAreas] = useState<Array<DataArea> | undefined>(undefined);

    const handleWindowResize = () => {
        if (canvasParentRef.current) {
            setCurrentSize({
                width: canvasParentRef.current.clientWidth,
                height: canvasParentRef.current.clientHeight
            });
        }
    };

    const handleDataAreas = (data: Array<DataArea>) => {
        setDataAreas(data);
    };

    useEffect(() => {
        setImageData(props.imageData);
    }, [props]);

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
                    sendDataArea = { handleDataAreas }
                />
            </div>

            <div style={{width: "100%"}}>
                { 
                    dataAreas && dataAreas.length > 0 ? dataAreas.map((dataArea) => {
                        return (<DataAreaInfo dataArea={dataArea} />)
                    }) : <p>Draw something!</p>
                }
            </div>
        </div>
    )
};

export default Displayer;
