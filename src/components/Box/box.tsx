import { ReactNode } from "react";

export interface BoxProps {
    text: string;
    backgroundColor: string;
    borderColor?: string;
    children?: ReactNode;
};

const Box = ( props: BoxProps ) => {
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
                <p className="color-white my-auto flex-grow">{ props.text }</p>
                { props.children }
            </div>
        </div>
    )
};

export default Box;
