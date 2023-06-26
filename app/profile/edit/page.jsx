'use client';

import { useSession } from 'next-auth/react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import axios from "axios";
import CloseButton from "@/components/CloseButton";
import Image from "next/image";
import {Cropper} from "react-advanced-cropper";
import Link from "next/link";
import {dataURLtoBlob} from "@/utils/dataUrlToBlob";
import {useDropzone} from "react-dropzone";
import "react-advanced-cropper/dist/style.css";
import 'react-advanced-cropper/dist/themes/compact.css';

const MyProfile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  const [myData, setMyData] = useState({ username: '', userImage: '', image: ''});
  const [submitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState('');
  const cropperRef = useRef(null);
  const inputRef = useRef();
  const { data: session, status } = useSession();

  useEffect(() => {
    const getUserData = async () => {
      const response = await fetch(`/api/users/edit/${userId}`);
      const data = await response.json();

      setMyData({
        username: data.username,
        userImage: data.userImage,
        image: data.image,
      });
    };

    if (userId) getUserData();
  }, [userId]);

  const clearFile = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFileChange = (file) => {
    let maxSize = 9000000; // 12MB

    if (file && file.size > maxSize) {
      alert("File is too large, please pick a file smaller than 9MB.");
      return;
    }

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview('');
      clearFile();
    }
  };

  const handleInputChange = useCallback(
    (event) => {
      const { name, value, files } = event.target;
      setMyData((prevPost) => ({
        ...prevPost,
        [name]: files ? files[0] : value,
      }));
    },
    [setMyData],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let blob;
    let imageUrl = myData.userImage;
    let cropper = cropperRef.current;

    try {
      if (cropper) {
        const canvas = cropper.getCanvas();
        const dataURL = canvas.toDataURL();
        blob = dataURLtoBlob({dataURL});
      }

      if (blob) {
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('upload_preset', 'u7gwudke');

        const imageResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_CLOUDINARY_API_URL}`, formData,
        );
        if (imageResponse.data.error) {
          throw new Error('Failed to upload image');
        }
        setMyData({ ...myData, userImage: imageResponse.data.secure_url });
        imageUrl = imageResponse.data.secure_url;
      }

      const response = await fetch(`/api/users/edit/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          username: myData.username,
          userImage: imageUrl,
          image: myData.image,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update data');
      }

      router.push('/profile');
    } catch (error) {
      console.error("An error occurred:", error);
      alert('Failed to post data')
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 940);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    handleFileChange(acceptedFiles[0]);
  }, []);

  const { getRootProps, open, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': [],
      'image/gif': []
    },
    onDrop,
    noClick: true,
    maxFiles: 1,
  });

  return (
    <section className='w-full max-w-full flex-start flex-col'>
      <form
        onSubmit={handleSubmit}
        className='p-4 gap-5 glassmorphism mt-8 w-full flex flex-col xs:flex-row'
      >
        <div className='xs:w-[50%] w-full'>
          <label>
            <div className='w-full flex-center items-center'>
              {isMobile ? (
                <div className='flex w-full justify-between items-center p-2 mb-2 border-4 border-dashed border-gray-200 rounded-lg bg-white bg-opacity-50'>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                    name='image'
                    ref={inputRef}
                  />
                  <CloseButton isMobile={isMobile} handleFileChange={handleFileChange} />
                </div>
              ) : (
                <div className='w-full flex items-center gap-2 p-4 mb-2 h-[56px] border-4 border-dashed border-gray-300 rounded-lg bg-white bg-opacity-50'>
                  <div required {...getRootProps()} onClick={open}
                       className='w-full cursor-pointer'>
                    {isDragActive ?
                      <p>Drop the file here...</p> :
                      <p>Drag 'n' drop image here, or click to select</p>
                    }
                  </div>
                  <CloseButton handleFileChange={handleFileChange} />
                </div>
              )}
            </div>
            {myData.image && !preview && !myData.userImage && (
              <div
                className={'relative my-4 w-full h-[350px] border-gray-200 border-2 bg-amber-50 rounded-lg'}>
                <Image style={{ objectFit: 'contain' }} fill={true} alt={'preview image'}
                       src={myData.image ? myData.image : '/assets/icons/infinity1.svg'} />
              </div>
            )}
            {myData.userImage && !preview && (
              <div
                className={'relative my-4 w-full h-[350px] border-gray-200 border-2 bg-amber-50 rounded-lg'}>
                <Image style={{ objectFit: 'contain' }} fill={true} alt={'preview image'}
                       src={myData.userImage ? myData.userImage : '/assets/icons/infinity1.svg'} />
              </div>
            )}
          </label>
          <div className={preview ? 'w-full h-[350px] xs:h-[600px]' : 'h-fit'}>
            <Cropper
              ref={cropperRef}
              src={preview}
              stencilProps={{
                grid: true
              }}
            />
          </div>
        </div>

        <div className='xs:w-[50%] w-full'>
          <label>
            <div className='mt-2 font-satoshi font-semibold text-base text-gray-700'>
              Change nickname
            </div>
            <input
              name='username'
              value={myData.username}
              onChange={handleInputChange}
              type='text'
              placeholder='Nickname'
              className='form_input'
            />
          </label>

          <div className='flex-end mt-2 mx-3 mb-5 gap-4'>
            <Link href='/' className='text-gray-500 text-sm'>
              Cancel
            </Link>

            <button
              type='submit'
              disabled={submitting}
              className='px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white'
            >
              {submitting ? `Updating...` : `Update`}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default MyProfile;
