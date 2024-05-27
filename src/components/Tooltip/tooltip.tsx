import { ReactNode, useState } from "react";

export interface TooltipProps {
    children: ReactNode;
    text?: string;
    top?: number;
    left?: number;
    backgroundColor?: string;
};

const Tooltip = ( props: TooltipProps ) => {
    const [display, setDisplay] = useState<boolean>(false);

    return (
        <div className="p-relative w-100">
            
            <div
                className = "cursor-pointer" 
                onMouseEnter = { () => setDisplay(true) } 
                onMouseLeave={ () => setDisplay(false) }
            >
                { props.children }
            </div>

            <div 
                className = "p-absolute border-radius-5"
                style = {{
                    transform: "translate(-50%, 30%)",
                    top: props.top ? `${ props.top }px` : "50%",
                    left: props.left ? `${ props.left }px` : "50%",
                    padding: "10px 20px",
                    backgroundColor: props.backgroundColor ?? "#484F56",
                    width: "max-content",
                    maxWidth: "200px",
                    zIndex: "1000",
                    display: display && props.text ? 'block' : 'none'
                }}
            >
                <p 
                    className="color-white "
                    style = {{ 
                        fontSize: "10px", 
                    }}
                >
                    { props.text }
                </p>
            </div>
        </div>
    )
};

export default Tooltip;
