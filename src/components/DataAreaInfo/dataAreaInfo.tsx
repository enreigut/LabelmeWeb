import { DataArea } from "../../interfaces/dataArea"

export interface DataAreaInfoProps {
    dataArea: DataArea
}

const DataAreaInfo = ( props: DataAreaInfoProps ) => {
    return (
        <div style={{width: "100%"}}>
            <h3>Label: { props.dataArea.label }</h3>
            <p>Color: { props.dataArea.color}</p>
            <div style={{width: "100%"}}>
                <pre 
                    style={{ 
                        background: '#f6f8fa', 
                        padding: '10px', 
                        borderRadius: '5px', 
                        whiteSpace: 'pre-wrap', 
                        wordWrap: 'break-word',
                        border: '1px solid #ddd',
                        fontFamily: 'Courier, monospace',
                        fontSize: '10px'
                    }}
                >
                    {JSON.stringify(props.dataArea.polygon, null, 2)}
                </pre>
            </div>
        </div>
    )
}

export default DataAreaInfo;