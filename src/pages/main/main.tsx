import { useState } from "react";

import Loader from "../../components/loader/Loader";
import Displayer, { Size } from "../../components/displayer/Displayer";

export interface ImageData {
    name: string;
    size: Size<number>;
    urlResource: string;
};

const MainPage = () => {
    const [imageData, setImageData] = useState<ImageData | undefined>(undefined);

    const handleLoadImage = (imageData: ImageData | undefined) => {
        setImageData(imageData);
    };

    return (
        <div 
            style={{
                width: "100%",
                padding: "10px"
            }}
        >
            <Displayer imageData ={ imageData } />
            <Loader loadImageData = { handleLoadImage }/>
        </div>
    )
};

export default MainPage;
