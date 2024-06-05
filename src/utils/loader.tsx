import { calculateRelativePoint } from "./math";
import {v4 as uuidv4} from 'uuid'

import { DataArea } from "../interfaces/dataArea";
import { ImageData } from "../interfaces/imageData";
import { Labelme, Shape } from "../interfaces/labelme";
import { generateRandomColor, overrideDefaultConfigWithReservedKeywordConfig } from "./draw";
import { Size } from "../interfaces/size";
import { ReservedKeyword } from "../interfaces/reservedKeyword";

// Function for when we export the data. It just maps from our custom data type to something that is understandable
export const mapDataAreaToShape = (dataArea: DataArea, imageData: ImageData, newDesiredSize?: Size<number>): Shape => {
    return {
        label: dataArea.label,
        points: dataArea.polygon.points.map((point) => {
            const p = calculateRelativePoint(point, newDesiredSize ?? (imageData.size ?? { width: 1280, height: 720 }))
            return [p.x, p.y]
        }),
        group_id: null,
        shape_type: "polygon",
        flags: {}
    }
};

// Function for when we load in the data. It just maps from our external format to something that is understandable for us
export const mapLabelmeToDatashare = (labelme: Labelme, canvasSize: Size<number>, configuration: ReservedKeyword): Array<DataArea> => {
    return labelme.shapes.map((x) => {
        const dataArea: DataArea = {
            id: uuidv4(),
            color:  generateRandomColor(0.5),
            label: x.label,
            polygon: {
                points: x.points.map((pointArray) => { 
                    const relativePoint = calculateRelativePoint(
                        { 
                            x: pointArray[0],
                            y: pointArray[1],
                            scale: {
                                width: labelme.imageWidth,
                                height: labelme.imageHeight
                            }
                        },
                        canvasSize
                    );
                    return relativePoint;
                })
            }
        };
        
        overrideDefaultConfigWithReservedKeywordConfig(dataArea, configuration);

        return dataArea;
    });
}
