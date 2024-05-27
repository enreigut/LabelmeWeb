import { useState } from "react";
import { changeOpcaityFromColor, generateRandomColor } from "../../utils/draw";

import { DataArea } from "../../interfaces/dataArea"

import TooltipButton from "../TooltipButton/tooltipButton";

export interface DataAreaInfoProps {
    className?: string;
    dataArea: DataArea;

    // update method
    updateDataArea: (dataArea: DataArea) => void;
    editDataArea: (dataArea: DataArea) => void;
    deleteDataArea: (dataArea: DataArea) => void;
}

const DataAreaInfo = ( props: DataAreaInfoProps ) => {
    const [label, setLabel] = useState<string>(props.dataArea.label);
    const [edit, setEdit] = useState<boolean>(false);

    return (
        <div className={["row", props.className].join(" ")}>
            <div className="col-12">
                <div 
                    className="w-100 border-radius-5 p-4" 
                    style={{ backgroundColor: "#2e3440" }}
                >
                    <div className="d-flex">
                        {
                            <p className="color-white my-auto d-flex flex-grow">
                                <i className="font-small my-auto">Label</i>
                                {
                                    edit
                                    ? (
                                        <input 
                                            type="text" 
                                            className="mx-2 font-opensans p-1 border-0"
                                            onChange = {(e) => {
                                                setLabel(e.target.value);
                                            }}
                                            value = { label }
                                            placeholder = { props.dataArea.label } 
                                        />
                                    )
                                    : <b className="ml-2"> { props.dataArea.label }</b>
                                }
                            </p>
                        }
 
                        <div className="d-flex">
                            {
                                edit
                                    ? 
                                        <div className="">
                                            <TooltipButton 
                                                text= "Save"
                                                backgroundColor = "#54a0ff"
                                                borderColor = "#2e86de"
                                                fontColor="white"
                                                disabled = { false }
                                                onClick={() => {
                                                    props.dataArea.label = label;
                                                    props.updateDataArea(props.dataArea);
                                                    setEdit(false);
                                                }}
                                            />
                                        </div>
                                    : 
                                        <div>
                                            <TooltipButton 
                                                text= "Edit"
                                                backgroundColor = "#54a0ff"
                                                borderColor = "#2e86de"
                                                fontColor="white"
                                                disabled = { false }
                                                onClick={() => {
                                                    props.editDataArea(props.dataArea);
                                                    setEdit(true);
                                                }}
                                            />
                                        </div>
                            }

                            <div className="mx-2">
                                <TooltipButton 
                                    text="Change Color"
                                    backgroundColor = { props.dataArea.color }
                                    borderColor = { changeOpcaityFromColor(props.dataArea.color, 1) }
                                    fontColor = "white"
                                    disabled = { false }
                                    onClick={() => {
                                        props.dataArea.color = generateRandomColor(0.5);
                                        props.updateDataArea(props.dataArea);
                                    }}
                                />
                            </div>    
                            
                            <div>
                                <TooltipButton 
                                    text= "Delete"
                                    backgroundColor = "#ff6b6b"
                                    borderColor = "#ee5253"
                                    fontColor = "white"
                                    disabled = { edit }
                                    onClick={() => { 
                                        if (!edit) {
                                            props.deleteDataArea(props.dataArea); } 
                                        }
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    
                </div> 
            </div>
        </div>
    )
}

export default DataAreaInfo;