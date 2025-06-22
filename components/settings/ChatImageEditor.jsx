import "react-mobile-cropper/dist/style.css";

import imageCompression from "browser-image-compression";
import { useRef, useState } from "react";
import { Cropper } from "react-mobile-cropper";

import OkButton from "./OkButton";

const ChatImageEditor = ({ chatImage, onImageUpdate }) => {
    const [cropperVisible, setCropperVisible] = useState(false);
    const [currentImage, setCurrentImage] = useState(chatImage);
    const cropperRef = useRef(null);

    const compressImage = async (dataURL) => {
        const file = dataURLToFile(dataURL, "image.jpg");
        const options = {
            maxSizeMB: 0.1,
            maxWidthOrHeight: 50,
            useWebWorker: true,
        };

        try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.error("Error compressing image:", error);
            return null;
        }
    };

    const dataURLToFile = (dataURL, filename) => {
        const arr = dataURL.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCropperVisible(true);
                setCurrentImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        const cropper = cropperRef.current;
        let dataURL;

        if (cropper) {
            const canvas = cropper.getCanvas();
            if (canvas !== null) {
                dataURL = canvas.toDataURL("image/jpeg", 1);
            }
        }

        if (dataURL) {
            const compressedFile = await compressImage(dataURL);
            if (compressedFile) {
                dataURL = await convertFileToBase64(compressedFile);
            }
        }

        onImageUpdate(dataURL || currentImage);
        setCropperVisible(false);
    };

    return (
        <div className="flex flex-col w-full gap-2">
            <label htmlFor="chat-image-input" className="text-[16px] font-light text-zinc-200">
                Change chat image
            </label>
            <div className="flex w-full gap-2 items-center">
                <input id="chat-image-input" className="w-full" type="file" accept="image/*" onChange={handleImageChange} />
                <OkButton onClick={handleSave} title="Save chat image" />
            </div>

            {cropperVisible && currentImage && (
                <div className="w-[250px] h-[250px]">
                    <Cropper
                        ref={cropperRef}
                        src={currentImage}
                        className="cropper"
                        stencilProps={{
                            grid: true,
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ChatImageEditor;
