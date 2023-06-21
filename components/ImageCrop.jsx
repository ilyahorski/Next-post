import React, { useEffect, useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageCrop = ({ preview, setPreview, setFileSelected }) => {
  const imgRef = useRef(null);
  const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 16 / 9 });
  const [completedCrop, setCompletedCrop] = useState(null);

  const onLoad = (img) => {
    imgRef.current = img;
  };

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onCropComplete = (crop) => {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(
        imgRef.current,
        crop,
        "newFile.jpeg"
      );
      setCompletedCrop(crop);
      setPreview(croppedImageUrl);
    }
  };

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          blob.name = fileName;
          window.URL.revokeObjectURL(preview);
          setFileSelected(blob);
          resolve(window.URL.createObjectURL(blob));
        },
        'image/jpeg',
        1
      );
    });
  };

  return (
    <>
      {preview && (
        <ReactCrop
          src={preview}
          onImageLoaded={onLoad}
          crop={crop}
          onChange={onCropChange}
          onComplete={onCropComplete}
        />
      )}
      {completedCrop && (
        <div>
          <img
            ref={imgRef}
            src={preview}
            alt="Crop preview"
            style={{ maxHeight: "300px" }}
          />
        </div>
      )}
    </>
  );
};

export default ImageCrop;
