import {useState, useEffect, useRef} from 'react';
import { Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';

const ImageCropper = ({ src, onCrop }) => {
  const cropperRef = useRef(null);

  const cropImage = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCroppedCanvas();
      canvas.toBlob((blob) => onCrop(blob));
    }
  };

  return (
    <div>
      <Cropper
        ref={cropperRef}
        src={src}
        onInitialize={(instance) => {
          cropperRef.current = instance;
        }}
      />
      <button onClick={cropImage}>Crop</button>
    </div>
  );
};

export default ImageCropper;