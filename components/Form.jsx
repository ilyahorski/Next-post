'use client'

import Link from 'next/link';
import Image from 'next/image';
import {useCallback, useEffect, useState} from 'react';
import { useDropzone } from "react-dropzone";
import CloseButton from "@/components/CloseButton";

import { Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import 'react-advanced-cropper/dist/themes/compact.css';
import {ToastContainer} from "react-toastify";

const Form = (
  {
    cropperRef,
    inputRef,
    type,
    post,
    preview,
    handleInputChange,
    handleFileChange,
    submitting,
    handleSubmit
  }) => {

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
      <h2 className='head_text text-center -mt-10'>
        <span className='blue_gradient'>{type}e Post</span>
      </h2>

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
            {post.image && !preview && (
              <div
                className={'relative my-4 w-full h-[350px] xs:h-[600px] border-gray-200 border-2 bg-amber-50 rounded-lg'}>
                <Image style={{ objectFit: 'contain' }} fill={true} alt={'preview image'}
                       src={post.image ? post.image : '/assets/icons/loader.svg'} />
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
            <div className='flex w-full h-[56px] items-center justify-start font-satoshi font-semibold text-2xl text-gray-700'>
              Post description
            </div>

            <textarea
              name='post'
              value={post.post}
              onChange={handleInputChange}
              placeholder='Write your post here'
              required
              className='form_textarea'

            />
          </label>

          <label>
          <div className='mt-2 font-satoshi font-semibold text-base text-gray-700'>
            Field of Tag{' '}
            <span className='font-normal'>
              (#post, #photo, #tag, etc.)
            </span>
          </div>
            <input
              name='tag'
              value={post.tag}
              onChange={handleInputChange}
              type='text'
              placeholder='#Tag'
              pattern='#[\p{L}\p{N}_]+(\s*,\s*#[\p{L}\p{N}_]+)*\s*'
              required
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
              {submitting ? `${type}ing...` : `${type}e`}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Form;
