export interface RenderTypeProps {
    theme: Theme,
    objKey: string;
    objValue: any;
};

const renderType = (props: RenderTypeProps) => {
    console.log(typeof props.objValue, props.objKey);
    switch (typeof props.objValue) {
        case "string": 
            return (
                <RenderString
                    theme = { props.theme } 
                    objKey = { props.objKey } 
                    objValue = { props.objValue }/>
            )
        case "number": {
            return (
                <RenderNumber 
                    theme = { props.theme }
                    objKey = { props.objKey } 
                    objValue = { props.objValue }/>
            )
        }
        case "object": {
            if (Array.isArray(props.objValue)) {
                return (
                    <RenderArray 
                        theme = { props.theme}
                        objKey = { props.objKey } 
                        objValue = { props.objValue }/>
                )
            } else {
                return (
                    <RenderObject 
                        theme = { props.theme }
                        objKey = { props.objKey } 
                        objValue = { props.objValue }/>
                )
            }
        }
        default: return (<></>)
    }
};

interface RenderKeyProps {
    theme: Theme;
    objKey: string;
}

const renderKey = ( props: RenderKeyProps ) => {
    return (
        typeof Number(props.objKey) === "number"
            ? (
                <>
                    <span style={{ color: props.theme.themeColor.indexColor }}>{ props.objKey }</span>
                    <button onClick={() => { console.log(typeof props.objKey) }}></button>
                </>
            )
            : (
                <>
                    <span style={{ color: props.theme.themeColor.quotesColor }}>{ props.theme.quoteType }</span>
                    <span style={{ color: props.theme.themeColor.keyColor }}>{ props.objKey }</span>
                    <span style={{ color: props.theme.themeColor.quotesColor }}>{ props.theme.quoteType }</span>
                    <button onClick={() => { console.log(props.objKey) }}></button>
                </>
            )
    )
}

interface RenderArrayProps {
    theme: Theme;
    objKey: string;
    objValue: Array<any>;
};

const RenderArray = (props: RenderArrayProps) => {
    return (
        <div>
            <span style={{ display: "inline-flex", alignItems: "center"}}>
                { renderKey({theme: props.theme, objKey: props.objKey}) }
                <span style={{ color: props.theme.themeColor.colonColor}} className="mr-1">{ ":" }</span>
                <span className="mr-1">{ "[" }</span>
                <span>{ `${props.objValue.length} item(s)` }</span>
            </span>

            {
                props.objValue.length > 0 
                ? (
                    <div className="ml-2">
                        {
                            props.objValue.map((item, idx) => {
                                return renderType({theme: props.theme, objKey: `${idx}`, objValue: item})
                            })
                        }
                    </div>
                )
                : <></>
            }
            
            <span>{ "]" }</span>
            <span>{ props.theme.delimitter }</span>
        </div>
    )
};

interface RenderObjectProps {
    theme: Theme;
    objKey: string;
    objValue: any | null;
};

const RenderObject = (props: RenderObjectProps) => {
    return (
        <div>
            <span style={{ display: "inline-flex", alignItems: "center"}}>
                { renderKey({theme: props.theme, objKey: props.objKey}) }
                <span style={{ color: props.theme.themeColor.colonColor}} className="mr-1">{ ":" }</span>
                <span className="mr-1">{ "{" }</span>
            </span>

            {
                props.objValue && Object.keys(props.objValue).length > 0
                ? 
                (
                    <div className="ml-2">
                        { 
                            Object.keys(props.objValue).map((key) => {
                                return renderType({theme: props.theme, objKey: key, objValue: props.objValue[key]})
                            }) 
                        }
                    </div>
                )
                :<></>
            }

            <span>{ "}" }</span>
            <span>{ props.theme.delimitter }</span>
        </div>
    )
};

interface RenderStringProps {
    theme: Theme;
    objKey: string;
    objValue: string;
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
            <span>{ props.theme.delimitter }</span>
        </div>
    )
};

interface RenderNumbergProps {
    theme: Theme;
    objKey: string;
    objValue: number;
};

const RenderNumber = (props: RenderNumbergProps) => {
    return (
        <div>
            <span style={{ color: props.theme.themeColor.quotesColor }}>{ props.theme.quoteType }</span>
            <span style={{ color: props.theme.themeColor.keyColor }}>{ props.objKey }</span>
            <span style={{ color: props.theme.themeColor.quotesColor }}>{ props.theme.quoteType }</span>
            <span style={{ color: props.theme.themeColor.colonColor}} className="mr-1">{ ":" }</span>
            <span style={{ color: props.theme.themeColor.types.numberColor, opacity: "0.8"}} className="px-2">{ "number" }</span>
            <span style={{ color: props.theme.themeColor.types.numberColor}}>{ props.objValue }</span>
            <span>{ props.theme.delimitter }</span>
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
    numberColor: string;
    indexColor: string;
    types: {
        stringColor: string;
        numberColor: string;
    }
};

export interface JSONViewerProps {
    object: any | undefined;
};

const JSONViewer = ( props: JSONViewerProps ) => {
    // Configuration
    const defaultTheme: Theme = {
        quoteType: '"',
        delimitter: ',',
        themeColor: {
            keyColor: "#a5d6ff",
            quotesColor: "red",
            colonColor: "#6d9fac",
            numberColor: "",
            indexColor: "#268bd2",
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
            className="p-4 border-radius-5"
            style={{
                fontFamily: "monospace",
                lineHeight: "1.4",
                fontSize: "13px"
            }}
        >
            {
                props.object !== undefined
                ?   Object.keys(props.object).map((key) => {
                        return renderType(
                            { 
                                theme: defaultTheme,
                                objKey: key, 
                                objValue: props.object[key]
                            })
                    })
                : <></>
            }
            <pre 
                className="font-small p-4 border-radius-5 border-2"
                style={{ 
                    background: '#576574', 
                    whiteSpace: 'pre-wrap', 
                    wordWrap: 'break-word',
                    fontFamily: 'Courier',
                    borderColor: '#8395a7',
                    color: '#a5d6ff'
                }}
            >
                { objectToString() }
            </pre>
        </div>
    )
};

export default JSONViewer;
