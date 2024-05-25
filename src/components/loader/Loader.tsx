import { useEffect, useState } from "react";
import { calculateRelativePoint } from "../../utils/math";

import { Size } from "../../interfaces/size";
import { ImageData } from "../../interfaces/imageData";
import { DataArea } from "../../interfaces/dataArea";
import { Labelme, Shape } from "../../interfaces/labelme";

import Box from "../Box/box";
import Submit1 from "../Inputs/Submit1";
import Button1 from "../Inputs/Button1";


export interface LoaderProps {
    dataAreas: Array<DataArea> | undefined;

    loadImageData: (data: ImageData | undefined) => void;
    exportDataArea: (labelme: Labelme) => void;
};

const Loader = (props: LoaderProps) => {
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [imageData, setImageData] = useState<ImageData | undefined>(undefined);
    
    useEffect(() => {
        props.loadImageData(imageData);
    }, [ imageData, props]);

    const loadImage = (e:React.ChangeEvent<HTMLInputElement>) => {
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
                calculateRelativePoint(point, imageData?.size ?? { width: 1280, height: 720 })
                return [point.x, point.y]
            }),
            group_id: null,
            shape_type: "polygon",
            flags: {}
        }
    };

    // Function that maps from DataArea to labelme interface with correct dimensions
    const exportDataAreas = () => {
        if (props.dataAreas) {
            props.exportDataArea({
                version: "4.6.0",
                flags: {},
                shapes: props.dataAreas.map((dataArea) => mapDataAreaToShape(dataArea))
            });
        }
    };

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
                                                <Button1 
                                                    text = "Load Data"
                                                    backgroundColor = "#1dd1a1"
                                                    borderColor = "#10ac84"
                                                    onClick={() => {}}
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
                                                    onClick={() => {}}
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
