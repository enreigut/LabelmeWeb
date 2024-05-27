import { IconType } from "react-icons";
import IconWrapper from "../IconWrapper/iconWrapper";
import Tooltip from "../Tooltip/tooltip";
import { CSSProperties, ChangeEventHandler, useEffect, useState } from "react";

export interface TooltipSubmitProps {
    text: string;
    disabled: boolean;
    padding?: string;
    backgroundColor?: string;
    borderColor?: string;
    fontColor?: string;
    icon?: IconType
    accept?: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
}

const TooltipSubmit = (props: TooltipSubmitProps) => {
    // Configuration
    const breakpointPx: number = 760;

    // State
    const [showIcon, setShowIcon] = useState<boolean>(false);
    const [tooltipText, setToolTipText] = useState<string | undefined>(undefined);

    const handleResize = () => {
        if (window.innerWidth <= breakpointPx) {
            setShowIcon(true);
            setToolTipText(props.text);
        } else {
            setShowIcon(false);
            setToolTipText(undefined);
        }
    };

    useEffect(() => {
        if (showIcon) {
            setToolTipText(props.text);
        }
    }, [ props ]);

    useEffect(() => {
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return (
        <Tooltip
            top = { 40 }
            text = { tooltipText }
        >

            <label 
                className = {`font-opensans d-block font-bold font-small border-2 border-radius-5 transition-all-4 ${ props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                style={{
                    padding: props.padding ?? "5px 10px",
                    backgroundColor: props.disabled ? "#9b9b9b" : props.backgroundColor ?? "#484F56",
                    borderColor: props.disabled ? "#7f8c8d" : props.borderColor ?? "#3d3d3d"
                }}
            >
                <input
                    className="d-none"
                    type="file"
                    onChange={(e) => {
                        if (!props.disabled) {
                            props.onChange(e)
                        } 
                    }} 
                    accept = { props.accept }
                />

                <div className="d-flex color-white">
                    {
                        props.icon && showIcon 
                            ? <IconWrapper classname = "m-auto" style = {{ padding: "5px 10px"}} icon = { props.icon } /> 
                            : (<p className="m-auto text-center"> { props.text } </p>)
                    }
                </div>
            </label>

        </Tooltip>
    )
};

export default TooltipSubmit;
