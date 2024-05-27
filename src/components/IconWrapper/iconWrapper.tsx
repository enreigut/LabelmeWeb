import { CSSProperties, useState } from "react";
import { IconType } from "react-icons";

export interface IconWrapperProps {
    icon: IconType
    classname?: string;
    style?: CSSProperties;
    tooltip?: string;
};

const IconWrapper = ( props: IconWrapperProps) => {
    const Icon = props.icon;

    return (
        <div 
            className = { ["d-flex", props.classname].join(" ") } 
            style = { props.style }
        >
            <Icon />
        </div>
    )
};

export default IconWrapper;