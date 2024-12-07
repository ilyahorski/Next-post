'use client';

import { useEffect, useRef, useState, useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import Form from '~/components/Form';
import { useSubmitHandler}  from "~/utils/hooks/useSubmitHandler";
import { useInputChangeHandler}  from "~/utils/hooks/useInputChangeHandler";
import {SessionContext} from "~/utils/context/SocketContext";

const UpdatePost = () => {
  const [post, setPost] = useState({ post: '', tag: '', image: '' });
  const handleInputChange = useInputChangeHandler(setPost);
  const searchParams = useSearchParams();
  const cropperRef = useRef(null);
  const postId = searchParams.get('id');
  const [fileData, setFileData] = useState(null);
  const sessionId = useContext(SessionContext);

  const buildRequestBody = ({post, imageUrl}) => ({
    post: post.post,
    tag: post.tag,
    image: imageUrl,
  });

  const { handleSubmit, isSubmitting } = useSubmitHandler(
    fileData,
    sessionId,
    post,
    cropperRef,
    setPost,
    'Failed to post data',
    `/api/post/${postId}`,
    'PATCH',
    '/',
    buildRequestBody
  );

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

  return (
    <Form
      setFileData={setFileData}
      cropperRef={cropperRef}
      type='Updat'
      post={post}
      handleInputChange={handleInputChange}
      submitting={isSubmitting}
      handleSubmit={handleSubmit}
    />
  );
};

export default UpdatePost;
