import { useState } from "react";
import { changeOpcaityFromColor, generateRandomColor } from "../../utils/draw";

import { DataArea } from "../../interfaces/dataArea"

import TooltipButton from "../TooltipButton/TooltipButton";

export interface DataAreaInfoProps {
    className?: string;
    dataArea: DataArea;

    // update method
    updateDataArea: (dataArea: DataArea) => void;
    deleteDataArea: (dataArea: DataArea) => void;
}

const DataAreaInfo = ( props: DataAreaInfoProps ) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    const [label, setLabel] = useState<string>(props.dataArea.label);
    const [edit, setEdit] = useState<boolean>(false);

    return (
        <div className={"row " + props.className ?? ""}>
            <div className="col-12">
                <div 
                    className="w-100 border-3 border-radius-5 p-4" 
                    style={{ backgroundColor: "rgba(255,255,255,0.2)", borderColor: props.dataArea.color }}
                >
                    <div className="d-flex mb-4">
                        {
                            edit 
                            ? (
                                <h4 className="color-white my-auto flex-grow">
                                    <b>Label name:</b>
                                    <input 
                                        type="text" 
                                        onChange = {(e) => {
                                            setLabel(e.target.value);
                                        }}
                                        value = { label }
                                        placeholder = { props.dataArea.label } 
                                    />
                                </h4>
                            )
                            : <h4 className="color-white my-auto flex-grow"><b>Label name:</b> { props.dataArea.label }</h4>
                        }
 
                        <div className="d-flex">
                            {
                                edit
                                    ? <TooltipButton 
                                        text= "Save"
                                        backgroundColor = "#54a0ff"
                                        borderColor = "#2e86de"
                                        fontColor="white"
                                        onClick={() => {
                                            props.dataArea.label = label;
                                            props.updateDataArea(props.dataArea);
                                            setEdit(false);
                                            setExpanded(false);
                                        }}
                                    /> 
                                    : <TooltipButton 
                                            text= "Edit"
                                            backgroundColor = "#54a0ff"
                                            borderColor = "#2e86de"
                                            fontColor="white"
                                            onClick={() => {
                                                setEdit(true);
                                                setExpanded(true);
                                            }}
                                        />
                            }
                            
                            <TooltipButton 
                                text= "Delete"
                                backgroundColor = "#ff6b6b"
                                borderColor = "#ee5253"
                                fontColor="white"
                                onClick={() => { props.deleteDataArea(props.dataArea); } }
                            />
                        </div>
                    </div>
                    
                    <div className="d-flex mb-1">
                        <p className="font-small color-white my-auto"><b>Color:</b></p>

                        <div className="ml-2">
                            <TooltipButton 
                                text="Change"
                                backgroundColor = { props.dataArea.color }
                                borderColor = { changeOpcaityFromColor(props.dataArea.color, 1) }
                                fontColor = "white"
                                onClick={() => {
                                    props.dataArea.color = generateRandomColor(0.5);
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
                    
                    <div className="w-100 mb-2">
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
                            { JSON.stringify(props.dataArea.polygon, null, 2) }
                        </pre>
                    </div>
                    
                </div> 
            </div>
        </div>
    )
}

export default DataAreaInfo;