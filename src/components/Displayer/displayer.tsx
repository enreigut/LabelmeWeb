// Components
import { DataArea } from "../../interfaces/dataArea";
import DataAreaInfo from "../DataAreaInfo/dataAreaInfo";

export interface DisplayerProps {
    dataAreas: Array<DataArea> | undefined;
    updateDataAreas: (dataArea: DataArea) => void;
    editDataArea: (dataArea: DataArea) => void;
    deleteDataAreaFromDataAreas: (dataArea: DataArea) => void;
}

const Displayer = (props: DisplayerProps) => {

    const updateDataArea = (dataArea: DataArea) => {
        props.updateDataAreas(dataArea);
    }

    const deleteDataArea = (dataArea: DataArea) => {
        props.deleteDataAreaFromDataAreas(dataArea);
    }

    return (
        <div className="w-100">

            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="color-white">Labels</h2>
                </div>
            </div>

            {
                props.dataAreas !== undefined && 0 !== props.dataAreas.length 
                    ? (
                        <div className="row">
                            <div className="col-12">
                                <p className="color-white mb-2">Some related information to the drawn areas:</p>
                                <p className="font-small color-white mb-2"><b>Number of polygons:</b> {props.dataAreas.length}</p>
                                <p className="font-small color-white mb-2"><b>Number of vertices:</b> {props.dataAreas.reduce((x,y) => {return (x + y.polygon.points.length)}, 0)}</p>
                            </div>
                        </div>
                    )
                    :(
                        <div className="row">
                            <div className="col-12">
                                <p className="color-white">Waiting for some labels to get going</p>
                            </div>
                        </div>
                    )
            }

            {
                props.dataAreas 
                    ? (
                        <div className="row">
                            <div className="col-12 pb-2">
                                { 
                                    props.dataAreas?.map((dataArea, idx) => {
                                        return (
                                            <DataAreaInfo 
                                                key={`data_area_${dataArea.label}_${idx}`} 
                                                className="mb-2" 
                                                dataArea= { dataArea }
                                                updateDataArea = { updateDataArea }
                                                editDataArea = { props.editDataArea }
                                                deleteDataArea = { deleteDataArea }
                                            />)
                                    })
                                }
                            </div>
                        </div>
                    )
                    :<></>
            }            
        </div>
    )
};

export default Displayer;
