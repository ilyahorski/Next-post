'use client';

import {useCallback, useEffect, useState} from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Form from '@/components/Form';
import axios from 'axios';

const CreatePost = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [submitting, setIsSubmitting] = useState(false);
  const [fileSelected, setFileSelected] = useState('');
  const [post, setPost] = useState({ post: '', tag: '', image: '' });

  const [preview, setPreview] = useState(null);

  const [crop, setCrop] = useState(null);
  const [cropper, setCropper] = useState(false);

  // const handleFileChange = (file) => {
  //   const reader = new FileReader();
  //
  //   if (file) {
  //     reader.onloadend = () => {
  //       setPreview(reader.result);
  //       setFileSelected(file);
  //     };
  //     reader.readAsDataURL(file);
  //
  //   } else {
  //     setFileSelected('');
  //     setPreview(null);
  //   }
  // };

  const handleFileChange = (file) => {
    if (file) {
      setFileSelected(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setCropper(true); // Устанавливаем состояние обрезки в true
      };
      reader.readAsDataURL(file);
    } else {
      setFileSelected(null);
      setPreview(null);
      setCropper(false); // Устанавливаем состояние обрезки в false
    }
  };

  const handleInputChange = useCallback(
    (event) => {
      const { name, value, files } = event.target;
      setPost((prevPost) => ({
        ...prevPost,
        [name]: files ? files[0] : value,
      }));
    },
    [setPost],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let imageUrl = post.image;

    try {
      if (fileSelected) {
        const formData = new FormData();

        if (crop) {
          const croppedImage = await cropper.crop();
          formData.append('file', croppedImage);
        }

        formData.append('file', fileSelected);
        formData.append('upload_preset', 'u7gwudke');

        const imageResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_CLOUDINARY_API_URL}`, formData,
        );
        if (imageResponse.data.error) {
          throw new Error('Failed to upload image');
        }
        setPost({ ...post, image: imageResponse.data.secure_url });
        imageUrl = imageResponse.data.secure_url;
      }

      const response = await fetch('/api/post/new', {
        method: 'POST',
        body: JSON.stringify({
          post: post.post,
          userId: session?.user.id,
          tag: post.tag,
          image: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post data');
      }

      router.push('/');
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error('Data was not sent, please try later');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Form
        type='Create'
        post={post}
        preview={preview}
        setPreview={setPreview}
        fileSelected={fileSelected}
        setFileSelected={setFileSelected}
        handleFileChange={handleFileChange}
        submitting={submitting}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        crop={crop}
        setCrop={setCrop}
        cropper={cropper}
        setCropper={setCropper}
      />
      <ToastContainer />
    </>
  );
};

export default CreatePost;
