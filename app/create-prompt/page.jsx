'use client';

import { useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Form from '@/components/Form';
import axios from 'axios';

const CreatePrompt = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [submitting, setIsSubmitting] = useState(false);
  const [fileSelected, setFileSelected] = useState('');
  const [post, setPost] = useState({ prompt: '', tag: '', image: '' });

  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
      setFileSelected(file);
    } else {
      setPreview(null);
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

      const response = await fetch('/api/prompt/new', {
        method: 'POST',
        body: JSON.stringify({
          prompt: post.prompt,
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
        handleFileChange={handleFileChange}
        submitting={submitting}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
      <ToastContainer />
    </>
  );
};

export default CreatePrompt;