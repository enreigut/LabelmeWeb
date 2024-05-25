export interface TooltipButtonProps {
    text: string;
    backgroundColor?: string;
    borderColor?: string;
    fontColor?: string;
    onClick: () => void;
}

const TooltipButton = (props: TooltipButtonProps) => {
        return (
        <button 
            className = "font-opensans font-small border-2 border-radius-5 transition-all-4 cursor-pointer font-bold"
            style = {{
                padding: "5px 10px",
                backgroundColor: props.backgroundColor ?? "#9b9b9b",
                borderColor: props.borderColor ?? "#3d3d3d",
                color: props.fontColor ?? "#3d3d3d"
            }}
            onClick={ props.onClick }
        >
            { props.text }
        </button>
    )
};

export default TooltipButton;
