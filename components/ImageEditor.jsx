import CloseButton from "~/components/CloseButton";
import {useFileHandler} from "~/utils/hooks/useFileHandler";
import {useImageDropzone} from "~/utils/hooks/useImageDropzone";
import {useMobileCheck} from "~/utils/hooks/useMobileCheck";
import {Cropper} from 'react-mobile-cropper';
import 'react-mobile-cropper/dist/style.css'
import VideoPlayer from "~/components/VideoPlayer";

const ImageEditor = ({setFileData, dataType, googleDataType, post, cropperRef}) => {
  const {preview, fileType, inputRef, handleFileChange} = useFileHandler(setFileData);
  const {getRootProps, open, isDragActive} = useImageDropzone({handleFileChange});
  const isMobile = useMobileCheck();


  return (
    <div className='xs:w-[50%] w-full h-fit'>
      <label>
        <div className='w-full flex-center items-center'>
          {isMobile ? (
            <div
              className='flex w-full justify-between items-center p-2 mb-2 border-4 border-dashed border-gray-200 rounded-lg bg-white bg-opacity-50'>
              <input
                type="file"
                onChange={(e) => handleFileChange(e.target.files[0])}
                name='image'
                ref={inputRef}
              />
              <CloseButton isMobile={isMobile} handleFileChange={handleFileChange}/>
            </div>
          ) : (
            <div
              className='w-full flex items-center gap-2 p-4 mb-2 h-[56px] border-4 border-dashed border-gray-300 rounded-lg bg-white bg-opacity-50'>
              <div required {...getRootProps()} onClick={open}
                   className='w-full cursor-pointer'>
                {isDragActive ?
                  <p>Drop the file here...</p> :
                  <p>Drag 'n' drop image here, or click to select</p>
                }
              </div>
              <CloseButton handleFileChange={handleFileChange}/>
            </div>
          )}
        </div>
      </label>
      {fileType === 'image' || dataType === 'image' || googleDataType === 'lh3' ? (
        <div className={preview || post.userImage || post.image ? 'w-full h-[450px] xs:h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px]' : 'hidden'}>
          <Cropper
            ref={cropperRef}
            src={preview ? preview : (post.userImage ? post.userImage : post.image)}
            className='cropper'
            stencilProps={{
              grid: true
            }}
          />
        </div>
      ) : (
        <VideoPlayer post={post} preview={preview}/>
      )}
    </div>
  );
};

export default ImageEditor;
