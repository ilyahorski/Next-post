import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {dataURLtoBlob} from "~/utils/dataUrlToBlob";

export const useSubmitHandler = (
  fileData,
  sessionId,
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

      if (!sessionId) {
        console.error("Session or user ID is missing");
        alert('Session is not available, please log in again');
        setIsSubmitting(false);
        return;
      }

      let blob;
      let imageUrl = post.image;
      let cropper = cropperRef.current;

      try {
        if (fileData && fileData.type === 'video') {
          try {
            const formData = new FormData();
            formData.append("file", fileData.data);
            formData.append("filename", fileData.name);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/cloud-upload`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': "https://next-post-two.vercel.app",
              },
            });

            const responseWithBody = await response.data;
            setPost({ ...post, image: responseWithBody.publicUrl });
            imageUrl = responseWithBody.publicUrl;
          } catch (e) {
            console.log(e, 'Error');
          }
        }

        if (cropper) {
          const canvas = cropper.getCanvas();
          if (canvas !== null) {
            const dataURL = canvas.toDataURL('image/jpeg', 1);
            blob = dataURLtoBlob({dataURL});
          }
        }

        if (blob && fileData && fileData.type === 'image') {
          try {
            const formData = new FormData();
            formData.append('file', blob);
            formData.append("filename", fileData.name);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/cloud-upload`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Access-Control-Allow-Origin': "https://next-post-two.vercel.app",
              },
            });

            const responseWithBody = await response.data;
            setPost({ ...post, image: responseWithBody.publicUrl });
            imageUrl = responseWithBody.publicUrl;
          } catch (e) {
            console.log(e, 'Error');
          }
        }

        const requestBody = buildRequestBody({post, sessionId, imageUrl});
        const response = await fetch(apiEndpoint, {
          method: httpMethod,
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error('Failed to post data try again');
        }

        router.push(routerDestination);
      } catch (error) {
        console.error("An error occurred:", error);
        alert(alertMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [sessionId, post, cropperRef, setPost, alertMessage, apiEndpoint, httpMethod, routerDestination, buildRequestBody],
  );

  return { handleSubmit, isSubmitting };
};
