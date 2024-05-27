import { useState } from "react";

import { ImageData } from "../../interfaces/imageData";
import { DataArea } from "../../interfaces/dataArea";
import { Labelme } from "../../interfaces/labelme";
import { Size } from "../../interfaces/size";

import Loader from "../../components/Loader/loader";
import Displayer from "../../components/Displayer/displayer";
import Canvas from "../../components/Canvas/canvas";
import Box from "../../components/Box/box";
import Exporter from "../../components/Exporter/exporter";
import { ReservedKeyword } from "../../interfaces/reservedKeyword";
import { overrideDefaultConfigWithReservedKeywordConfig } from "../../utils/draw";

const MainPage = () => {
    // Configuration
    const reservedKeywords: ReservedKeyword = {
        "blackout_area": { polygonColor: "rgba(0,0,0,1)" }
    };

    // States
    const [canvasSize, setCanvasSize] = useState<Size<number> | undefined>(undefined);
    const [imageData, setImageData] = useState<ImageData | undefined>(undefined);
    const [dataAreas, setDataAreas] = useState<Array<DataArea> | undefined>([]);
    const [editedDataArea, setEditedDataArea] = useState<DataArea | undefined>(undefined);
    const [dataToExport, setDataToExport] = useState<Labelme | undefined>(undefined);
    const [mode, setMode] = useState<string | undefined>(undefined);

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

    const handleMode = (mode: string) => {
        setMode(mode);
    };

    const updateDataAreas = (dataArea: DataArea) => {
        if (dataAreas !== undefined && dataAreas.length > 0) {
            
            if (dataAreas) {
                dataAreas.forEach((dataArea) => overrideDefaultConfigWithReservedKeywordConfig(dataArea, reservedKeywords));
            }

            const idxOfTargetDataArea = dataAreas.findIndex(x => x.id === dataArea.id);

            if (idxOfTargetDataArea !== -1) {
                dataAreas[idxOfTargetDataArea] = dataArea;
                setMode("Waiting")
                setEditedDataArea(undefined);
                setDataAreas([...dataAreas]);
            }
        }
    };

    const editDataArea = (dataArea: DataArea) => {
        setMode(`Editing Data Area with label: ${ dataArea.label }`)
        setEditedDataArea(dataArea);
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
                   <p className="color-white font-small">Operation: <b><i>{ mode ?? "Waiting" }</i></b></p>
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
                                    editedDataArea = { editedDataArea }
                                    sendDataArea = { handleDataAreas }
                                    handleCanvasSize = { handleCanvasSize }
                                    handleMode = { handleMode }
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
                    <Displayer 
                        dataAreas = { dataAreas }
                        editedDataArea = { editedDataArea }
                        configuration = { reservedKeywords }
                        updateDataAreas = { updateDataAreas }
                        deleteDataAreaFromDataAreas = { deleteDataAreaFromDataAreas }
                        editDataArea = { editDataArea }
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-10 col-m-10 p-2 mx-auto">
                    <Exporter dataToExport = { dataToExport }/>
                </div>
            </div>

        </div>
    )
};

export default MainPage;
