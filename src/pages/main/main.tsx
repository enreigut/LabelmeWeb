import { useState } from "react";

import { ImageData } from "../../interfaces/imageData";
import { DataArea } from "../../interfaces/dataArea";
import { Labelme } from "../../interfaces/labelme";
import { Size } from "../../interfaces/size";

import Loader from "../../components/Loader/Loader";
import Displayer from "../../components/Displayer/Displayer";
import Canvas from "../../components/Canvas/canvas";
import Box from "../../components/Box/box";
import JSONViewer from "../../components/JSONViewer/jsonViewer";


const MainPage = () => {
    // States
    const [canvasSize, setCanvasSize] = useState<Size<number> | undefined>(undefined);
    const [imageData, setImageData] = useState<ImageData | undefined>(undefined);
    const [dataAreas, setDataAreas] = useState<Array<DataArea> | undefined>([]);
    const [dataToExport, setDataToExport] = useState<Labelme | undefined>(undefined);

    const handleCanvasSize = (canvasSize: Size<number> | undefined) => {
        setCanvasSize(canvasSize);
    };

    const handleLoadImage = (imageData: ImageData | undefined) => {
        setImageData(imageData);

        if (imageData === undefined) {
            setDataAreas([]);
        }
    };

    const handleDataAreas = (dataAreas: Array<DataArea> | undefined) => {
        setDataAreas(dataAreas);
    };

    const updateDataAreas = (dataArea: DataArea) => {
        if (dataAreas !== undefined && dataAreas.length > 0) {
            const idxOfTargetDataArea = dataAreas.findIndex(x => x.id === dataArea.id);
            if (idxOfTargetDataArea !== -1) {
                dataAreas[idxOfTargetDataArea] = dataArea;
                setDataAreas([...dataAreas]);
            }
        }
    };

    const deleteDataAreaFromDataAreas = (dataArea: DataArea) => {
        if (dataAreas !== undefined && dataAreas.length > 0) {
            setDataAreas([...dataAreas.filter((x) => x.id !== dataArea.id)]);
        }
    };

    const exportDataAreas = (labelme: Labelme) => {
        setDataToExport(labelme);
    }

    return (
        <div className="cont">
            <div className="row">
                <div className="col-10 col-m-10 p-2 mx-auto">
                    <h1 className="color-white">LabelmeUI</h1>
                </div>
            </div>

            <div className="row">
                <div className="col-10 col-m-10 p-2 mx-auto">
                    {
                        imageData !== undefined 
                            ? (
                                <Canvas 
                                    imageData = { imageData } 
                                    dataAreas = { dataAreas ?? [] }
                                    sendDataArea = { handleDataAreas }
                                    handleCanvasSize = { handleCanvasSize }
                                />
                            )
                            : <Box text="Waiting for image" backgroundColor="rgba(116, 185, 255, 0.4)" borderColor="rgba(116, 185, 255, 0.4)"/>
                    }
                </div>
            </div>

            <div className="row">
                <div className="col-10 col-m-10 p-2 mx-auto">
                    <Loader 
                        dataAreas = { dataAreas }
                        canvasSize = { canvasSize }
                        loadDataAreas = { handleDataAreas }
                        loadImageData = { handleLoadImage }
                        exportDataArea = { exportDataAreas }
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-10 col-m-10 p-2 mx-auto">
                    <JSONViewer object = { dataToExport } />
                </div>
            </div>

            <div className="row">
                <div className="col-10 col-m-10 p-2 mx-auto">
                    <Displayer 
                        dataAreas = { dataAreas }
                        updateDataAreas = { updateDataAreas }
                        deleteDataAreaFromDataAreas = { deleteDataAreaFromDataAreas }
                    />
                </div>
            </div>

        </div>
    )
};

export default MainPage;
