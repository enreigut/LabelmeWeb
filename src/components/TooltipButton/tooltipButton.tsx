import { IconType } from "react-icons";
import IconWrapper from "../IconWrapper/iconWrapper";
import Tooltip from "../Tooltip/tooltip";
import { useEffect, useState } from "react";

export interface TooltipButtonProps {
    text: string;
    disabled: boolean;
    padding?: string;
    backgroundColor?: string;
    borderColor?: string;
    hoverColor?: string;
    fontColor?: string;
    icon?: IconType
    onClick: () => void;
}

const TooltipButton = (props: TooltipButtonProps) => {
    // Configuration
    const breakpointPx: number = 760;

    // State
    const [isHover, setIsHover] = useState<boolean>(false);
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
            <button 
                className = {`font-opensans font-small border-2 border-radius-5 transition-all-4 ${ props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'} font-bold w-100`}
                style = {{
                    padding: props.padding ?? "5px 10px",
                    backgroundColor: props.disabled ? "#9b9b9b" : isHover ? props.hoverColor ?? "white" : props.backgroundColor ?? "#9b9b9b",
                    borderColor: props.disabled ? "#7f8c8d" : props.borderColor ?? "#3d3d3d",
                    color: props.fontColor ?? "#3d3d3d"
                }}
                onMouseEnter = {() => { setIsHover(true); }}
                onMouseLeave = {() => { setIsHover(false); }}
                onClick={() => {
                    if(!props.disabled) {
                        props.onClick();
                    }
                }}
            >
                <div className="d-flex">
                    {
                        props.icon && showIcon ? <IconWrapper classname = "m-auto" style = {{ padding: "5px 10px"}} icon = { props.icon } /> : (<p className="m-auto text-center"> { props.text } </p>)
                    }
                </div>
            </button>
        </Tooltip>
    )
};

export default TooltipButton;
