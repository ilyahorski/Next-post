import { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const Cropp = ({ imageToCrop, croppedImage }) => {
  const [crop, setCrop] = useState(
    {
    unit: '%', // Can be 'px' or '%'
    x: 25,
    y: 25,
    width: 50,
    height: 50
  });
  const [image, setImage] = useState(null);

  const cropImageNow = () => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    const base64Image = canvas.toDataURL('image/jpeg');
    croppedImage(base64Image);
  };

  return (
    <div>
      <div>
        {imageToCrop && (
          <div>
            <ReactCrop
              src={imageToCrop}
              onImageLoaded={setImage}
              minHeight={50}
              minWidth={50}
              crop={crop}
              onChange={(c) => setCrop(c)} />
            <br />
            <button onClick={cropImageNow}>Crop</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cropp