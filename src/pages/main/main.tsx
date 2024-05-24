import { useState } from "react";

import Loader from "../../components/loader/Loader";
import Displayer from "../../components/displayer/Displayer";
import { ImageData } from "../../interfaces/imageData";


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
            <Loader loadImageData = { handleLoadImage }/>
            <Displayer imageData ={ imageData } />
        </div>
    )
};

export default MainPage;
