import { useEffect, useState } from "react";
import { Size } from "../displayer/Displayer";

export interface ImageData {
    name: string;
    size: Size<number>;
    urlResource: string;
};

export interface LoaderProps {
    loadImageData: (data: ImageData | undefined) => void;
};

const Loader = (props: LoaderProps) => {
    const [imageData, setImageData] = useState<ImageData | undefined>(undefined);
    
    useEffect(() => {
        props.loadImageData(imageData);
    }, [ imageData, props]);

    const loadImage = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const imageFile = e.target.files[0];
            const imageUrl = URL.createObjectURL(imageFile);
            
            getImageData(imageUrl)
            .then((data) => {
                setImageData({
                    name: imageFile.name,
                    size: {
                        width: data.width,
                        height: data.height
                    },
                    urlResource: imageUrl
                })
            });
        }        
    };

    const getImageData = (imageUrl: string): Promise<Size<number>> => {
        return new Promise<Size<number>>((resolve, reject) => {
            const img = new Image();

            img.src = imageUrl;

            img.onload = () => {
                resolve({ 
                    width: img.naturalWidth, 
                    height: img.naturalHeight
                 });
            };

            img.onerror = (err) => {
                reject(new Error(`Failed to load image`));
            };
        });
    }

    return (
        <div>
            <input
                type="file"
                name="image"
                onChange={ loadImage } 
            />
        </div>
    )
};

export default Loader;
