import { ReactNode, useState } from "react";
import IconWrapper from "../IconWrapper/iconWrapper";
import { FaCaretRight } from "react-icons/fa6";

export interface BoxProps {
    text: string;
    backgroundColor: string;
    borderColor?: string;
    children?: ReactNode;
};

const CollapseBox = ( props: BoxProps ) => {
    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <div 
            className = {`p-4 ${props.borderColor ? 'border-2' : ''} border-radius-5 font-bold`}
            style={{ 
                fontSize: "small",
                backgroundColor: props.backgroundColor,
                borderColor: props.borderColor ?? ""
            }}
        >
            <div className="d-flex flex-wrap">
                <div className="d-flex w-100 cursor-pointer" onClick = { (e) => { setExpanded(!expanded) } }>
                    <p className="color-white my-auto flex-grow">{ props.text }</p>
                    <IconWrapper classname = "m-auto transition-transform-4 color-white" style = {{ transform: expanded ? "rotateZ(90deg)" : "rotate(0deg)"}} icon = { FaCaretRight } />
                </div>
                <div className = { expanded ? 'd-block' : 'd-none' }>
                    { props.children }
                </div>
            </div>
        </div>
    )
};

export default CollapseBox;
