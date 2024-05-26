import { useEffect, useRef, useState } from "react";
import TooltipButton from "../TooltipButton/TooltipButton";

interface RenderTypeProps {
    theme: Theme,
    objKey: string;
    objValue: any;
    traillingComma: boolean;
};

const renderType = (props: RenderTypeProps) => {
    switch (typeof props.objValue) {
        case "string": 
            return (
                <RenderString
                    theme = { props.theme } 
                    objKey = { props.objKey } 
                    objValue = { props.objValue }
                    traillingComma = { props.traillingComma }/>
            )
        case "number": {
            return (
                <RenderNumber 
                    theme = { props.theme }
                    objKey = { props.objKey } 
                    objValue = { props.objValue }
                    traillingComma = { props.traillingComma }/>
            )
        }
        case "object": {
            if (Array.isArray(props.objValue)) {
                return (
                    <RenderArray 
                        theme = { props.theme}
                        objKey = { props.objKey } 
                        objValue = { props.objValue }
                        traillingComma = { props.traillingComma }/>
                )
            } else {
                return (
                    <RenderObject 
                        theme = { props.theme }
                        objKey = { props.objKey } 
                        objValue = { props.objValue }
                        traillingComma = { props.traillingComma }/>
                )
            }
        }
        default: return (<></>)
    }
};

interface CollapseArrowProps {
    color: string;
    collapsed: boolean;
    handleCollapse: () => void;
}

const CollapseArrow = ( props: CollapseArrowProps) => {
    const collapseArrowRref = useRef<HTMLSpanElement>(null);

    const rotateArrow = () => {
        props.handleCollapse();
    }

    useEffect(() => {
        if (collapseArrowRref.current) {
            if (props.collapsed) {
                collapseArrowRref.current.style.rotate = `${-90}deg`
            } else {
                collapseArrowRref.current.style.rotate = `${0}deg`
            }
        }
    }, [props.collapsed])

    return (
        <span 
            className="d-flex mr-1" 
            ref = { collapseArrowRref }
            onClick={() => { rotateArrow()}}>
            <svg 
                className="my-auto"
                viewBox="0 0 24 24" 
                fill="var(--w-rjv-arrow-color, currentColor)" 
                style={{
                    cursor: "pointer", 
                    height: "1em", 
                    width: "1em", 
                    userSelect: "none", 
                    display: "inline-flex",
                    color: props.color
                }}
            >
                <path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" />
            </svg>
        </span>
    )
};

interface RenderKeyProps {
    theme: Theme;
    objKey: string;
}

const renderKey = ( props: RenderKeyProps ) => {
    return (
        !Number.isNaN(+props.objKey)
            ? (
                <>
                    <span style={{ color: props.theme.themeColor.indexColor }}>{ props.objKey }</span>
                </>
            )
            : (
                <>
                    <span style={{ color: props.theme.themeColor.quotesColor }}>{ props.theme.quoteType }</span>
                    <span style={{ color: props.theme.themeColor.keyColor }}>{ props.objKey }</span>
                    <span style={{ color: props.theme.themeColor.quotesColor }}>{ props.theme.quoteType }</span>
                </>
            )
    )
}

interface RenderArrayProps {
    theme: Theme;
    objKey: string;
    objValue: Array<any>;
    traillingComma: boolean;
};

const RenderArray = (props: RenderArrayProps) => {
    const [collapsed, setCollapsed] = useState<boolean>(false);

    const handleCollapse = () => {
        setCollapsed(!collapsed);
    }

    return (
        <div>
            <span style={{ display: "inline-flex", alignItems: "center"}}>
                
                {
                    props.objValue && Object.keys(props.objValue).length > 0 
                        ? <CollapseArrow color = { props.theme.themeColor.collapseArrowColor } collapsed = { collapsed } handleCollapse={ handleCollapse } />
                        : <></>
                }

                { renderKey({theme: props.theme, objKey: props.objKey}) }
                <span style={{ color: props.theme.themeColor.colonColor }} className="mr-1">{ ":" }</span>
                <span style={{ color: props.theme.themeColor.quotesColor }} className="mr-1">{ "[" }</span>
                <span style={{ color: props.theme.themeColor.infoColor }}><i>{ `${props.objValue.length} item(s)` }</i></span>
            </span>

            {
                props.objValue.length > 0 && collapsed !== true
                ? (
                    <div className="pl-4 border-left-1 ml-1" style={{ borderColor: props.theme.themeColor.infoColor }}>
                        {
                            props.objValue.map((item, idx) => {
                                return renderType({theme: props.theme, objKey: `${idx}`, objValue: item, traillingComma: idx !== props.objValue.length - 1})
                            })
                        }
                    </div>
                )
                : <></>
            }
            
            <span className = "ml-1" style={{ color: props.theme.themeColor.quotesColor }}>{ "]" }</span>

            {
                props.traillingComma
                ?  <span style={{ color: props.theme.themeColor.delimitterColor }}>{ props.theme.delimitter }</span>
                : <></>
            }
        </div>
    )
};

interface RenderObjectProps {
    theme: Theme;
    objKey: string;
    objValue: any | null;
    traillingComma: boolean;
};

const RenderObject = (props: RenderObjectProps) => {
    const [collapsed, setCollapsed] = useState<boolean>(false);

    const handleCollapse = () => {
        setCollapsed(!collapsed);
    }

    return (
        <div>
            <span style={{ display: "inline-flex", alignItems: "center"}}>
                
                {
                    props.objValue && Object.keys(props.objValue).length > 0 
                    ? <CollapseArrow color = { props.theme.themeColor.collapseArrowColor } collapsed = { collapsed } handleCollapse={ handleCollapse } />
                    : <></>
                }
                
                { renderKey({theme: props.theme, objKey: props.objKey}) }

                { 
                    props.objKey.trim().length !== 0 
                    ? <span style={{ color: props.theme.themeColor.colonColor}} className="mr-1">{ ":" }</span>
                    : <></>
                }
                <span style={{ color: props.theme.themeColor.quotesColor }} className="mr-1">{ "{" }</span>
                
                { 
                    props.objValue && Object.keys(props.objValue).length > 0
                    ? <span style={{ color: props.theme.themeColor.infoColor}} className="mr-1"><i>{ `${Object.keys(props.objValue).length} item(s)`}</i></span>
                    : <></>
                }
            </span>

            {
                props.objValue && Object.keys(props.objValue).length > 0 && collapsed !== true
                ? 
                (
                    <div className="pl-4 border-left-1 ml-1" style={{ borderColor: props.theme.themeColor.infoColor }}>
                        { 
                            Object.keys(props.objValue).map((key, idx) => {
                                return renderType({theme: props.theme, objKey: key, objValue: props.objValue[key], traillingComma: idx !== Object.keys(props.objValue).length - 1})
                            }) 
                        }
                    </div>
                )
                :<></>
            }

            <span style={{ color: props.theme.themeColor.quotesColor }} className="ml-1">{ "}" }</span>

            {
                props.traillingComma
                ?  <span style={{ color: props.theme.themeColor.delimitterColor }}>{ props.theme.delimitter }</span>
                : <></>
            }
        </div>
    )
};

interface RenderStringProps {
    theme: Theme;
    objKey: string;
    objValue: string;
    traillingComma: boolean;
};

const RenderString = (props: RenderStringProps) => {
    return (
        <div>
            { renderKey({theme: props.theme, objKey: props.objKey}) }
            <span style={{ color: props.theme.themeColor.colonColor}} className="mr-1">{ ":" }</span>
            <span style={{ color: props.theme.themeColor.types.stringColor, opacity: "0.8"}} className="px-2">{ "string" }</span>
            <span style={{ color: props.theme.themeColor.types.stringColor }}>{ props.theme.quoteType }</span>
            <span style={{ color: props.theme.themeColor.types.stringColor }}>{ props.objValue }</span>
            <span style={{ color: props.theme.themeColor.types.stringColor }}>{ props.theme.quoteType }</span>

            {
                props.traillingComma
                ?  <span style={{ color: props.theme.themeColor.delimitterColor }}>{ props.theme.delimitter }</span>
                : <></>
            }
           
        </div>
    )
};

interface RenderNumbergProps {
    theme: Theme;
    objKey: string;
    objValue: number;
    traillingComma: boolean;
};

const RenderNumber = (props: RenderNumbergProps) => {
    return (
        <div>
            { renderKey({theme: props.theme, objKey: props.objKey}) }
            <span style={{ color: props.theme.themeColor.colonColor}} className="mr-1">{ ":" }</span>
            <span style={{ color: props.theme.themeColor.types.numberColor, opacity: "0.8"}} className="px-2">{ "number" }</span>
            <span style={{ color: props.theme.themeColor.types.numberColor}}>{ props.objValue }</span>
            
            {
                props.traillingComma
                ?  <span style={{ color: props.theme.themeColor.delimitterColor }}>{ props.theme.delimitter }</span>
                : <></>
            }

        </div>
    )
};

export interface Theme {
    quoteType: string;
    delimitter: string;
    themeColor: ThemeColor;
};


export interface ThemeColor {
    keyColor: string;
    quotesColor: string;
    colonColor: string;
    indexColor: string;
    infoColor: string;
    delimitterColor: string;
    collapseArrowColor: string;
    types: {
        stringColor: string;
        numberColor: string;
    }
};

export interface JSONViewerProps {
    className?: string;
    object: any | undefined;
};

const JSONViewer = ( props: JSONViewerProps ) => {

    // Configuration
    const defaultTheme: Theme = {
        quoteType: '"',
        delimitter: ',',
        themeColor: {
            keyColor: "#a5d6ff",
            quotesColor: "#a5d6ff",
            colonColor: "#6d9fac",
            indexColor: "#268bd2",
            infoColor: "#c7c7c74d",
            delimitterColor: "#e17055",
            collapseArrowColor: "#a5d6ff",
            types: {
                stringColor: "#a3be8c",
                numberColor: "#b48ead"
            }
        }
    }

    const objectToString = (): string => {
        return JSON.stringify(props.object, null, 2);
    }

    return (
        <div 
            className = {[props.className, "p-4 border-radius-5 o-x-auto"].join(" ")}
            style={{
                fontFamily: "monospace",
                lineHeight: "1.4",
                fontSize: "13px",
                backgroundColor: "#2e3440"
            }}
        >
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex">
                        <TooltipButton
                            text="Download .json"
                            onClick={() => {
                                const href = window.URL.createObjectURL(new Blob([objectToString()], {type: 'json'}));
                                const aElement = document.createElement("a");
                                aElement.setAttribute("download", "data.json");
                                aElement.href = href;
                                aElement.setAttribute('target', '_blank');
                                aElement.click();
                                window.URL.revokeObjectURL(href);
                                
                            }} 
                        />

                        <TooltipButton
                            text="Copy to clipboard"
                            onClick={() => {
                                navigator.clipboard.writeText(objectToString());
                            }} 
                        />
                    </div>
                </div>
            </div>

            <div>
                {
                    props.object !== undefined
                    ? (
                        <RenderObject objKey="" objValue= { props.object } theme={ defaultTheme } traillingComma = { false }/>
                    )
                    : <></>
                }
            </div>
        </div>
    )
};

export default JSONViewer;
