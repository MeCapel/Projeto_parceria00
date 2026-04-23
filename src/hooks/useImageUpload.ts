import { useState } from "react";
import { compressImageToBase64 } from "../utils/image";

export function useImageUpload() {
    const [image, setImage] = useState<string | null>(null);

    const handleImageChange = async (file: File) => {
        const base64 = await compressImageToBase64(file);
        setImage(base64);
        return base64;
    };

    const clearImage = () => {
        setImage(null);
    };

    return {
        image,
        setImage,
        handleImageChange,
        clearImage
    };
}