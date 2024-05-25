import { useState } from "react";

import { changeOpcaityFromColor, generateRandomColor } from "../../utils/draw";

import { DataArea } from "../../interfaces/dataArea"

import TooltipButton from "../TooltipButton/TooltipButton";

export interface DataAreaInfoProps {
    className?: string;
    dataArea: DataArea;

    // update method
    updateDataArea: (dataArea: DataArea) => void;
}

const DataAreaInfo = ( props: DataAreaInfoProps ) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <div className={"row " + props.className ?? ""}>
            <div className="col-12">
                <div 
                    className="w-100 border-3 border-radius-5 p-4" 
                    style={{ backgroundColor: "rgba(255,255,255,0.2)", borderColor: props.dataArea.color }}
                >
                    <h4 className="color-white mb-2"><b>Label name:</b> { props.dataArea.label }</h4>
                    
                    <div className="d-flex mb-1">
                        <p className="font-small color-white my-auto"><b>Color:</b></p>

                        <div className="ml-2">
                            <TooltipButton 
                                text="Change"
                                backgroundColor = { props.dataArea.color }
                                borderColor = { changeOpcaityFromColor(props.dataArea.color, 1) }
                                fontColor = "white"
                                onClick={() => {
                                    props.dataArea.color = generateRandomColor(0.5);;
                                    props.updateDataArea(props.dataArea);
                                }}
                            />
                        </div>                        
                    </div>
                    
                    <div className="d-flex mb-1">
                        <p className="font-small color-white my-auto"><b>Points:</b></p>

                        <div className="ml-2">
                            <TooltipButton 
                                text= { expanded ? "Collapse" : "Expand" }
                                onClick={() => {
                                    setExpanded(!expanded);
                                }}
                            />
                        </div>   

                    </div>
                    
                    <div style={{width: "100%"}}>
                        <pre 
                            className="font-small p-4 border-radius-5 border-1"
                            style={{ 
                                background: '#f6f8fa', 
                                whiteSpace: 'pre-wrap', 
                                wordWrap: 'break-word',
                                fontFamily: 'Courier',
                                borderColor: '#ddd',
                                display: expanded ? 'block' : 'none'
                            }}
                        >
                            {JSON.stringify(props.dataArea.polygon, null, 2)}
                        </pre>
                    </div>
                </div> 
            </div>
        </div>
    )
}

export default DataAreaInfo;