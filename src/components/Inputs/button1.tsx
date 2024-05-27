export interface Button1Props {
    text: string;
    backgroundColor?: string;
    borderColor?: string;
    fontColor?: string;
    onClick: () => void;
};

const Button1 = (props: Button1Props) => {
    return (
        <button 
            className="font-opensans text-center font-bold font-small border-2 border-radius-5 transition-all-4 cursor-pointer"
            style = {{
                padding: "10px 20px",
                backgroundColor: props.backgroundColor ?? "#484F56",
                borderColor: props.borderColor ?? "#3d3d3d",
                color: props.fontColor ?? "white"
            }}
            onClick={ props.onClick }
        >
            { props.text }
        </button>
    )
};

export default Button1;
