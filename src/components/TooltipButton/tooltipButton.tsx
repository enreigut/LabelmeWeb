export interface TooltipButtonProps {
    text: string;
    backgroundColor?: string;
    borderColor?: string;
    fontColor?: string;
    disabled: boolean;
    onClick: () => void;
}

const TooltipButton = (props: TooltipButtonProps) => {
        return (
        <button 
            className = {`font-opensans font-small border-2 border-radius-5 transition-all-4 ${ props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'} font-bold`}
            style = {{
                padding: "5px 10px",
                backgroundColor: props.disabled ? "#9b9b9b" : props.backgroundColor ?? "#9b9b9b",
                borderColor: props.disabled ? "#3d3d3d" : props.borderColor ?? "#3d3d3d",
                color: props.fontColor ?? "#3d3d3d"
            }}
            onClick={() => {
                if(!props.disabled) {
                    props.onClick();
                }
            }}
        >
            { props.text }
        </button>
    )
};

export default TooltipButton;
