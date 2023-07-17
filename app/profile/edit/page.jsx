'use client';

import Link from "next/link";
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInputChangeHandler } from "~/utils/hooks/useInputChangeHandler";
import { useSubmitHandler } from "~/utils/hooks/useSubmitHandler";
import ImageEditor from "~/components/ImageEditor";

const MyProfile = () => {
  const [post, setPost] = useState({ username: '', userImage: '', image: ''});

  const handleInputChange = useInputChangeHandler(setPost);
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  const cropperRef = useRef(null);
  const { data: session } = useSession();

  const buildRequestBody = ({post, imageUrl}) => ({
    username: post.username,
    userImage: imageUrl,
    image: post.image,
  });

  const { handleSubmit, isSubmitting } = useSubmitHandler(
    session,
    post,
    cropperRef,
    setPost,
    'Failed to update data',
    `/api/users/edit/${userId}`,
    'PATCH',
    '/profile',
    buildRequestBody
  );

  useEffect(() => {
    const getUserData = async () => {
      const response = await fetch(`/api/users/edit/${userId}`);
      const data = await response.json();

      setPost({
        username: data.username,
        userImage: data.userImage,
        image: data.image,
      });
    };

    if (userId) getUserData();
  }, [userId]);

  return (
    <section className='w-full max-w-full flex-start flex-col'>
      <form
        onSubmit={handleSubmit}
        className='p-4 gap-5 glassmorphism mt-8 w-full flex flex-col xs:flex-row'
      >
        <ImageEditor post={post} cropperRef={cropperRef}/>

        <div className='xs:w-[50%] w-full'>
          <label>
            <div className='mt-2 font-satoshi font-semibold text-base text-gray-700 dark:text-gray-300'>
              Change nickname
            </div>
            <input
              name='username'
              value={post.username}
              onChange={handleInputChange}
              type='text'
              placeholder='Nickname'
              className='form_input'
            />
          </label>

          <div className='flex-end mt-2 mx-3 mb-5 gap-4'>
            <Link href='/' className='text-gray-500 dark:text-gray-300 text-sm'>
              Cancel
            </Link>

            <button
              type='submit'
              disabled={isSubmitting}
              className='px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white'
            >
              {isSubmitting ? `Updating...` : `Update`}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default MyProfile;
