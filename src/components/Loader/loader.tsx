import { useEffect, useState } from "react";
import { mapDataAreaToShape, mapLabelmeToDatashare } from "../../utils/loader";

import { Size } from "../../interfaces/size";
import { ImageData } from "../../interfaces/imageData";
import { DataArea } from "../../interfaces/dataArea";
import { Labelme } from "../../interfaces/labelme";

import Box from "../Box/box";
import Submit1 from "../Inputs/submit1";
import Button1 from "../Inputs/button1";
import TooltipButton from "../TooltipButton/tooltipButton";
import { FaFileArrowUp, FaFileExport, FaTrashCan, FaUpload } from "react-icons/fa6";
import TooltipSubmit from "../TooltipSubmit/tooltipSubmit";

export interface LoaderProps {
    dataAreas: Array<DataArea> | undefined;
    canvasSize: Size<number> | undefined;

    loadImageData: (data: ImageData | undefined) => void;
    loadDataAreas: (data: Array<DataArea> | undefined) => void;
    exportDataArea: (labelme: Labelme, canvasSize: Size<number>) => void;
};

const Loader = (props: LoaderProps) => {
    // Configuration
    const defaultImageSize: Size<number> = {
        width: 1280,
        height: 720
    };
    
    // States
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [imageData, setImageData] = useState<ImageData | undefined>(undefined);
    
    
    const loadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setError(false)
            
            const imageFile = e.target.files[0];
            const imageUrl = URL.createObjectURL(imageFile);
            
            getImageData(imageUrl)
            .then((data) => {
                setImageData({
                    name: imageFile.name,
                    size: {
                        width: data.width,
                        height: data.height
                    },
                    urlResource: imageUrl
                })
            })
            .catch((err) => {
                console.error(err);
                setError(true);
                setErrorMessage("Failed to load image. Are you sure submitted file was an image?");
            });
        }
    };
    
    const getImageData = (imageUrl: string): Promise<Size<number>> => {
        return new Promise<Size<number>>((resolve, reject) => {
            const img = new Image();
            
            img.src = imageUrl;
            
            img.onload = () => {
                resolve({ 
                    width: img.naturalWidth, 
                    height: img.naturalHeight
                });
            };
            
            img.onerror = (err) => {
                console.error(err);
                reject(new Error(`Failed to load image`));
                setError(true);
                setErrorMessage("Failed to load image. Are you sure submitted file was an image?");
            };
        });
    };
    
    // Function that maps from DataArea to labelme interface with correct dimensions
    const exportDataAreas = () => {
        if (props.dataAreas && props.canvasSize && imageData) {
            props.exportDataArea(
                {
                    version: "4.6.0",
                    flags: {},
                    shapes: props.dataAreas.map((dataArea) => mapDataAreaToShape(dataArea, imageData)),
                    imageWidth: imageData.size.width,
                    imageHeight: imageData.size.height
                }, 
                props.canvasSize
            );
        }
    };

    const loadData = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setError(false)
            
            const dataFile = e.target.files[0];
            const filaReader = new FileReader();

            filaReader.onload = (e) => {
                if (e.target) {
                    const fileContent = e.target.result;

                    if (fileContent) {
                        const toJson: Labelme = JSON.parse(fileContent.toString()!);
                        const dataAreas: Array<DataArea> = mapLabelmeToDatashare(toJson, props.canvasSize ?? defaultImageSize);
                        props.loadDataAreas(dataAreas);
                    }
                }
            }
            
            filaReader.readAsText(dataFile);
        }
    }

    const deleteImageData = () => {
        setImageData(undefined);
    };
    
    useEffect(() => {
        props.loadImageData(imageData);
    }, [ imageData ]);

    return (
        <div className="w-100">
            <div className="row mb-2">
                <div className = "col-12 d-flex" style={{justifyContent: "space-between"}}>

                    <div className="w-100 mr-2">
                        <TooltipSubmit 
                            text="Submit File"
                            fontColor = "white"
                            icon = { FaFileArrowUp }
                            padding = "10px 20px"
                            backgroundColor="#484F56"
                            borderColor="#3d3d3d"
                            disabled = { false }
                            accept = "image/*"
                            onChange={ loadImage } 
                        />
                    </div>

                    <div className="w-100 mr-2">
                        <TooltipSubmit 
                            text="Load Labels"
                            fontColor = "white"
                            padding = "10px 20px"
                            icon = { FaFileArrowUp }
                            backgroundColor = "#1dd1a1"
                            borderColor = "#10ac84"
                            disabled = { imageData ? false : true }
                            accept = ".json"
                            onChange={ loadData } 
                        />
                    </div>

                    <div className="w-100 mr-2">
                        <TooltipButton 
                            text="Export Data"
                            padding = "10px 20px"
                            fontColor = "white"
                            icon = { FaFileExport }
                            backgroundColor="#54a0ff"
                            borderColor="#2e86de"
                            disabled = { props.dataAreas && props.dataAreas.length <= 0 ? true : false }
                            onClick={exportDataAreas} 
                        />
                    </div>

                   
                        <TooltipButton 
                            text="Delete Image"
                            padding = "10px 20px"
                            fontColor = "white"
                            icon = { FaTrashCan }
                            backgroundColor="#ff6b6b"
                            borderColor="#ee5253"
                            disabled={ imageData ? false : true }
                            onClick={deleteImageData} 
                        />
 

                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="">
                        {
                            error
                                ? <Box text={`${errorMessage}`} backgroundColor="rgba(231,76,60,0.5)" borderColor="rgba(192,57,43,0.8)"/>
                                : imageData 
                                    ? (
                                        <Box 
                                            text={`Loaded image: ${imageData.name}`} 
                                            backgroundColor="#2e3440"
                                        />
                                    )
                                    : <></>
                        }
                    </div>
                </div>

            </div>

        </div>
    )
};

export default Loader;
