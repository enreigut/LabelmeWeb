import { useState } from "react";

import { ImageData } from "../../interfaces/imageData";
import { DataArea } from "../../interfaces/dataArea";

import Loader from "../../components/Loader/Loader";
import Displayer from "../../components/Displayer/Displayer";
import Canvas from "../../components/Canvas/canvas";
import Box from "../../components/Box/box";
import { Labelme } from "../../interfaces/labelme";


const MainPage = () => {
    // States
    const [imageData, setImageData] = useState<ImageData | undefined>(undefined);
    const [dataAreas, setDataAreas] = useState<Array<DataArea> | undefined>(undefined);
    const [dataToExport, setDataToExport] = useState<Labelme | undefined>(undefined);

    const handleLoadImage = (imageData: ImageData | undefined) => {
        setImageData(imageData);
    };

    const handleDataAreas = (dataAreas: Array<DataArea> | undefined) => {
        setDataAreas(dataAreas);
    };

    const updateDataAreas = (dataArea: DataArea) => {
        if (dataAreas) {
            const idxOfTargetDataArea = dataAreas.findIndex(x => x.label === dataArea.label);
            dataAreas[idxOfTargetDataArea] = dataArea;
            setDataAreas([...dataAreas]);
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
                                    sendDataArea = { handleDataAreas }
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
                        loadImageData = { handleLoadImage }
                        exportDataArea = { exportDataAreas } 
                    />
                </div>
            </div>

            <div className="row">
                <div className="col-10 col-m-10 p-2 mx-auto">
                        <pre 
                            className="font-small p-4 border-radius-5 border-1"
                            style={{ 
                                background: '#f6f8fa', 
                                whiteSpace: 'pre-wrap', 
                                wordWrap: 'break-word',
                                fontFamily: 'Courier',
                                borderColor: '#ddd',
                            }}
                        >
                            { JSON.stringify(dataToExport, null, 2) }
                        </pre>
                </div>
            </div>

            <div className="row">
                <div className="col-10 col-m-10 p-2 mx-auto">
                    <Displayer 
                        dataAreas = { dataAreas }
                        updateDataAreas = { updateDataAreas }
                    />
                </div>
            </div>

        </div>
    )
};

export default MainPage;
