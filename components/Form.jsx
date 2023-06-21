'use client'

import Link from 'next/link';
import Image from 'next/image';
import {useCallback, useState} from 'react';
import { useDropzone } from "react-dropzone";
import { CiCircleRemove } from "react-icons/ci";
import Cropp from "@/components/Cropp";
import ImageCrop from "@/components/ImageCrop";
import ImageCropper from "@/components/Crop";

const Form = (
  {
    type,
    post,
    preview,
    setPreview,
    fileSelected,
    setFileSelected,
    crop,
    setCrop,
    cropper,
    setCropper,
    handleInputChange,
    handleFileChange,
    submitting,
    handleSubmit
  }) => {

  const handleCrop = useCallback( (blob) => {
    setFileSelected(blob);
    setCropper(false); // Обрезка завершена, устанавливаем состояние обрезки в false
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
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>{type} Post</span>
      </h1>
      <p className='desc text-left max-w-md'>
        {type} and share amazing Post with the world
      </p>

      <form
        onSubmit={handleSubmit}
        className='mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism'
      >
        <label>
          <div className='relative w-full flex-center items-center'>
            <div required {...getRootProps()} onClick={open}
                 className='w-full cursor-pointer p-4 border-4 border-dashed border-gray-200 rounded-lg bg-white bg-opacity-50'>
              {isDragActive ?
                <p>Drop the file here...</p> :
                <p>Drag 'n' drop some file here, or click to select file</p>
              }
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleFileChange(null);
              }}
              className='w-10 h-10 absolute right-0 bottom-3 text-red-700'
            >
              <CiCircleRemove
                className='w-6 h-6'/>
            </button>
          </div>
          {post.image && !preview && (
            <div
              className={'relative my-4 w-full h-[400px] md:h-[600px] border-gray-200 border-2 bg-amber-50 rounded-lg'}>
              <Image style={{ objectFit: 'contain' }} fill={true} alt={'preview image'}
                     src={post.image ? post.image : '/assets/icons/loader.svg'} />
            </div>
          )}
          {/*<div*/}
          {/*  placeholder='Select post photo'*/}
          {/*  className={preview ? 'relative my-4 w-full h-[400px] md:h-[600px] border-gray-200 border-2 bg-amber-50 rounded-lg' : 'hidden'}>*/}
          {/*  <Image style={{ objectFit: 'contain' }} fill={true} alt={'selected image'}*/}
          {/*         src={preview ? preview : '/assets/icons/loader.svg'} />*/}
          {/*</div>*/}
          {/*<div*/}
          {/*  placeholder='Select post photo'*/}
          {/*  className={preview ? 'relative my-4 w-full h-[400px] md:h-[600px] border-gray-200 border-2 bg-amber-50 rounded-lg' : 'hidden'}>*/}
          {/*  <ImageCrop preview={preview} setPreview={setPreview} setFileSelected={setFileSelected} />*/}
          {/*</div>*/}
          {/*<div>*/}
          {/*  <ImageCropper*/}
          {/*    image={preview}*/}
          {/*    onCrop={setCroppedImage}*/}
          {/*  />*/}
          {/*  {croppedImage && <Image*/}
          {/*    style={{ objectFit: 'contain' }}*/}
          {/*    fill={true}*/}
          {/*    alt={'selected image'}*/}
          {/*    src={croppedImage} />*/}
          {/*  }*/}
          {/*</div>*/}
          {preview && (
            <ImageCropper
              src={preview}
              onCrop={handleCrop}
            />
          )}
        </label>

        <label>
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            Your Post description
          </span>

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
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            Field of Tag{' '}
            <span className='font-normal'>
              (#post, #photo, #tag, etc.)
            </span>
          </span>
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

        <div className='flex-end mx-3 mb-5 gap-4'>
          <Link href='/' className='text-gray-500 text-sm'>
            Cancel
          </Link>

          <button
            type='submit'
            disabled={submitting}
            className='px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white'
          >
            {submitting ? `${type}ing...` : type}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
