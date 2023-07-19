'use client';

import { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import Form from '~/components/Form';
import { useSubmitHandler } from "~/utils/hooks/useSubmitHandler";
import { useInputChangeHandler } from "~/utils/hooks/useInputChangeHandler";

const CreatePost = () => {
  const [post, setPost] = useState({ post: '', tag: '', image: '' });
  const [fileData, setFileData] = useState(null);
  const handleInputChange = useInputChangeHandler(setPost);
  const cropperRef = useRef(null);
  const { data: session } = useSession();

  const buildRequestBody = ({post, session, imageUrl}) => ({
    post: post.post,
    userId: session.user.id,
    tag: post.tag,
    image: imageUrl,
  });

  const { handleSubmit, isSubmitting } = useSubmitHandler(
    fileData,
    session,
    post,
    cropperRef,
    setPost,
    'Failed to post data',
    '/api/post/new',
    'POST',
    '/',
    buildRequestBody
  );

  return (
    <Form
      setFileData={setFileData}
      cropperRef={cropperRef}
      type='Creat'
      post={post}
      handleInputChange={handleInputChange}
      submitting={isSubmitting}
      handleSubmit={handleSubmit}
    />
  );
};

export default CreatePost;
