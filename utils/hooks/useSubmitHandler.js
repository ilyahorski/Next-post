import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {dataURLtoBlob} from "~/utils/dataUrlToBlob";

export const useSubmitHandler = (
  session,
  post,
  cropperRef,
  setPost,
  alertMessage,
  apiEndpoint,
  httpMethod,
  routerDestination,
  buildRequestBody
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      if (!session || !session.user.id) {
        console.error("Session or user ID is missing");
        alert('Session is not available, please log in again');
        setIsSubmitting(false);
        return;
      }

      let blob;
      let imageUrl = post.image;
      let cropper = cropperRef.current;

      try {
        if (cropper) {
          const canvas = cropper.getCanvas();
          if (canvas !== null) {
            const dataURL = canvas.toDataURL('image/jpeg', 0.7);
            blob = dataURLtoBlob({dataURL});
          }
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

        const requestBody = buildRequestBody({post, session, imageUrl});
        const response = await fetch(apiEndpoint, {
          method: httpMethod,
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error('Failed to post data');
        }

        router.push(routerDestination);
      } catch (error) {
        console.error("An error occurred:", error);
        alert(alertMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [session, post, cropperRef, setPost, alertMessage, apiEndpoint, httpMethod, routerDestination, buildRequestBody],
  );

  return { handleSubmit, isSubmitting };
};
