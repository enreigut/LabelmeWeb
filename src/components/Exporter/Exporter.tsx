import JSONViewer from "../JSONViewer/jsonViewer";

export interface ExporterProps {
    dataToExport: any;
}

const Exporter = (props: ExporterProps) => {
    return (
        <div className="w-100">

            <div className="row mb-4">
                <div className="col-12">
                    <h2 className="color-white">Data to export</h2>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-12">
                <p className="color-white">Click export data to generate the data</p>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <JSONViewer object = { props.dataToExport } />
                </div>
            </div>
        </div>
    )
};

export default Exporter;
