import { useEffect, useState } from "react";
import { changeOpcaityFromColor, generateRandomColor, getOverridingConfiguration, hasOverridingConfig } from "../../utils/draw";

import { DataArea } from "../../interfaces/dataArea"
import { ReservedKeyword } from "../../interfaces/reservedKeyword";

import TooltipButton from "../TooltipButton/tooltipButton";
import IconWrapper from "../IconWrapper/iconWrapper";
import { FaCircleExclamation, FaCircleInfo, FaFloppyDisk, FaPaintRoller, FaPencil, FaTrashCan } from "react-icons/fa6";
import Tooltip from "../Tooltip/tooltip";

interface LabelProps {
    dataArea: DataArea;
    configuration: ReservedKeyword;
};

const Label = ( props: LabelProps ) => {
    return (
        <div className="ml-2"> 
            { 
                hasOverridingConfig(props.dataArea, props.configuration)
                ? ( <div className="d-flex">
                        <p className="my-auto"><b><i>{ props.dataArea.label }</i></b></p>
                        <Tooltip text = { getOverridingConfiguration(props.dataArea, props.configuration)?.description }>
                            <IconWrapper 
                                classname = "my-auto px-2 font-small"
                                style = {{ paddingTop: "5px" }}
                                icon = { FaCircleInfo } 
                                tooltip = "Reserved keyword"
                            />
                        </Tooltip>
                    </div> )
                : (<p className="my-auto"><b> { props.dataArea.label }</b></p>)
            }
        </div>
    )
};

export interface DataAreaInfoProps {
    className?: string;
    dataArea: DataArea;
    configuration: ReservedKeyword;
    editedDataArea: DataArea | undefined;

    // update method
    updateDataArea: (dataArea: DataArea) => void;
    editDataArea: (dataArea: DataArea) => void;
    deleteDataArea: (dataArea: DataArea) => void;
}

const DataAreaInfo = ( props: DataAreaInfoProps ) => {
    const [label, setLabel] = useState<string>(props.dataArea.label);
    const [edit, setEdit] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    const validateInput = (text: string): boolean => {
        if (text.length === 0) {
            setErrorMessage("Input cannot be empty");
            return false;
        }

        const regexp = /^[a-zA-Z0-9\s,'.-_]*$/;
        if (!regexp.test(text)) {
            setErrorMessage("String does not comply with valid text. No special chars. Only chars, digts, spaces and underscores");
            return false;
        }

        return true;
    }

    const editInput = (
        <div className="d-flex">
            <input 
                className="mx-2 font-opensans p-1"
                style = {{
                    borderColor: errorMessage ? "#ff7675" : ""
                }}
                type="text" 
                value = { label }
                placeholder = { props.dataArea.label } 
                onChange = {(e) => { setLabel(e.target.value); }}
            />

            {
                errorMessage 
                ? (
                    <div 
                        className="my-auto font-small"
                        style = {{
                            color: "#ff7675"
                        }}
                    >
                        <Tooltip
                            top = { -20 }
                            text = { errorMessage }
                        >
                            <IconWrapper icon = { FaCircleExclamation }/>
                        </Tooltip>
                    </div>
                )
                : <></>
            }
        </div>
    );

    return (
        <div className={["row", props.className].join(" ")}>
            <div className="col-12">
                <div 
                    className="w-100 border-radius-5 p-4" 
                    style={{ backgroundColor: "#2e3440" }}
                >
                    <div className="d-flex">
                        {
                            <div className="color-white mr-2 my-auto d-flex flex-grow">
                                <p className="my-auto font-small"><i>Label</i></p>
                                {
                                    edit 
                                    ? ( editInput ) 
                                    : (
                                        <Label 
                                            dataArea = { props.dataArea } 
                                            configuration = { props.configuration }
                                        />
                                    ) 
                                }
                            </div>
                        }
 
                        <div className="d-flex">

                            <div className="my-auto">
                                <TooltipButton 
                                    text = { edit ? "Save" : "Edit" }
                                    backgroundColor = "#54a0ff"
                                    borderColor = "#2e86de"
                                    fontColor="white"
                                    hoverColor = "#74b9ff"
                                    icon = { edit ? FaFloppyDisk : FaPencil }
                                    disabled = { 
                                        edit
                                            ? false 
                                            : props.editedDataArea !== undefined && (props.editedDataArea.id !== props.dataArea.id)
                                    }
                                    onClick={() => {
                                        if (edit) {
                                            const trimmedLabel = label.trim();
                                            if (validateInput(trimmedLabel)) {
                                                props.dataArea.label = trimmedLabel;
                                                props.updateDataArea(props.dataArea);
                                                setEdit(false);
                                            }
                                        } else {
                                            props.editDataArea(props.dataArea);
                                            setEdit(true);
                                        }
                                    }}
                                />
                            </div>

                            <div className="mx-2">
                                <TooltipButton 
                                    text="Change Color"
                                    backgroundColor = { props.dataArea.color }
                                    borderColor = { changeOpcaityFromColor(props.dataArea.color, 1) }
                                    fontColor = "white"
                                    hoverColor = { changeOpcaityFromColor(props.dataArea.color, 0.8) }
                                    icon = { FaPaintRoller }
                                    disabled = { hasOverridingConfig(props.dataArea, props.configuration) }
                                    onClick={() => {
                                        props.dataArea.color = generateRandomColor(0.5);
                                        props.updateDataArea(props.dataArea);
                                    }}
                                />
                            </div>    
                            
                            <div className = "my-auto">
                                <TooltipButton 
                                    text= "Delete"
                                    backgroundColor = "#ff6b6b"
                                    borderColor = "#ee5253"
                                    fontColor = "white"
                                    hoverColor = "#fc5c65"
                                    icon = { FaTrashCan }
                                    disabled = { edit }
                                    onClick={() => { 
                                        props.deleteDataArea(props.dataArea); } 
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