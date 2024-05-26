import { useEffect, useState } from "react";
import {v4 as uuidv4} from 'uuid'
import { calculateRelativePoint } from "../../utils/math";

import { Size } from "../../interfaces/size";
import { ImageData } from "../../interfaces/imageData";
import { DataArea } from "../../interfaces/dataArea";
import { Labelme, Shape } from "../../interfaces/labelme";

import Box from "../Box/box";
import Submit1 from "../Inputs/Submit1";
import Button1 from "../Inputs/Button1";
import { generateRandomColor } from "../../utils/draw";


export interface LoaderProps {
    dataAreas: Array<DataArea> | undefined;
    canvasSize: Size<number> | undefined;

    loadImageData: (data: ImageData | undefined) => void;
    loadDataAreas: (data: Array<DataArea> | undefined) => void;
    exportDataArea: (labelme: Labelme, canvasSize: Size<number>) => void;
};

const Loader = (props: LoaderProps) => {
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
    
    const mapDataAreaToShape = (dataArea: DataArea): Shape => {
        return {
            label: dataArea.label,
            points: dataArea.polygon.points.map((point) => {
                const p = calculateRelativePoint(point, imageData?.size ?? { width: 1280, height: 720 })
                return [p.x, p.y]
            }),
            group_id: null,
            shape_type: "polygon",
            flags: {}
        }
    };
    
    // Function that maps from DataArea to labelme interface with correct dimensions
    const exportDataAreas = () => {
        if (props.dataAreas && props.canvasSize) {
            props.exportDataArea(
                {
                    version: "4.6.0",
                    flags: {},
                    shapes: props.dataAreas.map((dataArea) => mapDataAreaToShape(dataArea)),
                    imageWidth: imageData?.size.width ?? 1280,
                    imageHeight: imageData?.size.height ?? 720
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
                    const dataAreas: Array<DataArea> = toJson.shapes.map((x) => {
                        return {
                            id: uuidv4(),
                            color: generateRandomColor(0.5),
                            label: x.label,
                            polygon: {
                                points: x.points.map((pointArray) => { 
                                    const relativePoint = calculateRelativePoint(
                                        { 
                                            x: pointArray[0],
                                            y: pointArray[1],
                                            scale: {
                                                width: toJson.imageWidth,
                                                height: toJson.imageHeight
                                            }
                                        },
                                        {
                                            width: 392,
                                            height: 256
                                        }
                                    );
                                    return relativePoint;
                                })
                            }
                        }
                    });

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
                                            backgroundColor="rgba(255,255,255,0.5)" 
                                            borderColor="rgba(255,255,255,0.8)"
                                        >
                                            <div className="d-flex">
                                                <Submit1 
                                                    text = "Load Data"
                                                    backgroundColor = "#1dd1a1"
                                                    borderColor = "#10ac84"
                                                    onChange={ loadData }
                                                />

                                                <Button1 
                                                    text = "Export Data"
                                                    backgroundColor = "#54a0ff"
                                                    borderColor = "#2e86de"
                                                    onClick={ exportDataAreas }
                                                />

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

            <div>

            </div>

        </div>
    )
};

export default Loader;
