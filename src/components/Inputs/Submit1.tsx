import { ChangeEventHandler } from "react";

export interface Submit1Props {
    text: string;
    backgroundColor?: string;
    borderColor?: string;
    fontColor?: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
}

const Submit1 = (props: Submit1Props) => {
    return (
        <label 
            className="font-opensans d-block text-center font-bold font-small border-2 border-radius-5 transition-all-4 cursor-pointer"
            style={{
                padding: "10px 20px",
                backgroundColor: props.backgroundColor ?? "#484F56",
                borderColor: props.borderColor ?? "#3d3d3d"
            }}
        >
            <input
                className="d-none"
                type="file"
                name="image"
                onChange={ props.onChange } 
            />
            <span style={{ color: props.fontColor ?? "white" }}>{ props.text }</span>
        </label>
    )
};

export default Submit1;
