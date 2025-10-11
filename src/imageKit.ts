import axios from "axios";

const PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY
const UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";
const URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT

//const UPLOAD_PRESET = "nextlvl-gems"; // pokud máš vytvořený preset v ImageKit (volitelné)

export const uploadToImageKit = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    // CORRECT: Encode the key to handle special characters like '+'
    formData.append("publicKey", encodeURIComponent(PUBLIC_KEY));

    formData.append("fileName", file.name);
    formData.append("folder", "/gems");

    try {
        const response = await axios.post(UPLOAD_URL, formData);
        return response.data.url;
    } catch (error: any) {
        console.error("ImageKit upload error - Full response:", error.response?.data);
        throw new Error("Failed to upload image.");
    }
};

export const getImageUrl = (path: string): string => {
    return `${URL_ENDPOINT}${path}`;
};
