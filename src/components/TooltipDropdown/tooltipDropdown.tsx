import { IconType } from "react-icons";
import IconWrapper from "../IconWrapper/iconWrapper";
import Tooltip from "../Tooltip/tooltip";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { FaCaretRight } from "react-icons/fa6";
import TooltipDropdownOption from "../TooltipDropdownOption/tooltipDropdownOption";
import { smoothScrollToElementById } from "../../utils/window";

export interface TooltipDropdownProps {
    text: string;
    disabled: boolean;
    children?: Array<ReactElement<typeof TooltipDropdownOption>>;
    padding?: string;
    backgroundColor?: string;
    borderColor?: string;
    hoverColor?: string;
    fontColor?: string;
    icon?: IconType
}

const TooltipDropdown = (props: TooltipDropdownProps) => {
    // Configuration
    const breakpointPx: number = 760;

    // State
    const [isHover, setIsHover] = useState<boolean>(false);
    const [showIcon, setShowIcon] = useState<boolean>(false);
    const [expanded, setExpanded] = useState<boolean>(false);
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
            text = { tooltipText }
            disable = { expanded }
        >
            <button 
                className = {`font-opensans font-small border-2 transition-background-4 ${ props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'} font-bold w-100`}
                style = {{
                    padding: props.padding ?? "5px 10px",
                    borderWidth: expanded ? "2px 2px 0px 2px " : "2px",
                    backgroundColor: props.disabled ? "#9b9b9b" : isHover ? props.hoverColor ?? "white" : props.backgroundColor ?? "#9b9b9b",
                    color: props.fontColor ?? "#3d3d3d",
                    borderColor: props.disabled ? "#7f8c8d" : props.borderColor ?? "#3d3d3d",
                    borderRadius: expanded ? "5px 5px 0px 0px": "5px"
                }}
                disabled = { props.disabled }
                onMouseEnter = {() => { setIsHover(true); }}
                onMouseLeave = {() => { setIsHover(false); }}
                onClick={() => {
                    if(!props.disabled) {
                        setExpanded(!expanded);
                    }
                }}
            >
                <div className="d-flex">
                    {
                        props.icon && showIcon 
                            ? <IconWrapper classname = "m-auto flex-grow" style = {{ padding: "5px 10px"}} icon = { props.icon } /> 
                            : (<p className="m-auto text-center  flex-grow"> { props.text } </p>)
                    }

                    <IconWrapper classname = "m-auto transition-transform-4" style = {{ transform: expanded ? "rotateZ(90deg)" : "rotate(0deg)"}} icon = { FaCaretRight } />
                </div>
            </button>

            <div className = "p-relative w-100" onMouseUp = {() => { 
                setExpanded(!expanded);
                smoothScrollToElementById("jsonViewer", 0.2);
            }}>
                <div 
                    className = { expanded ? "flex p-absolute w-100 border-2 o-hidden" : "d-none" }
                    style={{
                        borderWidth: expanded ? "0px 2px 2px 2px" : "2px",
                        borderColor: props.disabled ? "#7f8c8d" : props.borderColor ?? "#3d3d3d",
                        borderRadius: expanded ? "0px 0px 5px 5px" : "0px",
                    }}
                >
                    { props.children }
                </div>
            </div>
        </Tooltip>
    )
};

export default TooltipDropdown;
