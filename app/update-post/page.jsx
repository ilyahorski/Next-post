'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Form from '@/components/Form';
import axios from 'axios';
import { notifyError } from "@/components/Notify";
import {dataURLtoBlob} from "@/utils/dataUrlToBlob";
import {ToastContainer} from "react-toastify";

const UpdatePost = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');
  const [post, setPost] = useState({ post: '', tag: '', image: '' });
  const [submitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);

  const cropperRef = useRef(null);
  const inputRef = useRef();

  useEffect(() => {
    const getPostDetails = async () => {
      const response = await fetch(`/api/post/${postId}`);
      const data = await response.json();

      setPost({
        post: data.post,
        tag: data.tag,
        image: data.image,
      });
    };

    if (postId) getPostDetails();
  }, [postId]);

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

    let blob;
    let imageUrl = post.image;
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
        setPost({ ...post, image: imageResponse.data.secure_url });
        imageUrl = imageResponse.data.secure_url;
      }

      const response = await fetch(`/api/post/${postId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          post: post.post,
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
      alert('Failed to post data')
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      cropperRef={cropperRef}
      inputRef={inputRef}
      type='Updat'
      post={post}
      preview={preview}
      handleFileChange={handleFileChange}
      handleInputChange={handleInputChange}
      submitting={submitting}
      handleSubmit={handleSubmit}
    />
  );
};

export default UpdatePost;
