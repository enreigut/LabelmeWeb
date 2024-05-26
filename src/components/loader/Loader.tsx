import { useEffect, useState } from "react";
import { mapDataAreaToShape, mapLabelmeToDatashare } from "../../utils/loader";

import { Size } from "../../interfaces/size";
import { ImageData } from "../../interfaces/imageData";
import { DataArea } from "../../interfaces/dataArea";
import { Labelme } from "../../interfaces/labelme";

import Box from "../Box/box";
import Submit1 from "../Inputs/Submit1";
import Button1 from "../Inputs/Button1";

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
                    const fileContent = e.target?.result;
                    const toJson: Labelme = JSON.parse(fileContent?.toString()!);
                    const dataAreas: Array<DataArea> = mapLabelmeToDatashare(toJson, props.canvasSize ?? defaultImageSize);
                    props.loadDataAreas(dataAreas);
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
                <div className = "col-3">
                    <Submit1
                        text="Submit File"
                        accept="image/*"
                        onChange = { loadImage }
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
                                        >
                                            <div className="d-flex my-2">
                                                <Submit1 
                                                    text = "Load Labels"
                                                    backgroundColor = "#1dd1a1"
                                                    borderColor = "#10ac84"
                                                    accept = "*.json"
                                                    onChange={ loadData }
                                                />

                                                <div className="mx-2">
                                                    <Button1 
                                                        text = "Export Data"
                                                        backgroundColor = "#54a0ff"
                                                        borderColor = "#2e86de"
                                                        onClick={ exportDataAreas }
                                                    />
                                                </div>

                                                <Button1 
                                                    text = "Delete Image"
                                                    backgroundColor = "#ff6b6b"
                                                    borderColor = "#ee5253"
                                                    onClick={ deleteImageData }
                                                />
                                            </div>
                                        </Box>
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
