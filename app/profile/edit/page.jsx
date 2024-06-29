'use client';

import Link from "next/link";
import { useEffect, useRef, useState, useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInputChangeHandler } from "~/utils/hooks/useInputChangeHandler";
import { useSubmitHandler } from "~/utils/hooks/useSubmitHandler";
import ImageEditor from "~/components/ImageEditor";
import {SessionContext} from "~/utils/context/SocketContext";

const MyProfile = () => {
  const [post, setPost] = useState({ username: '', userImage: '', image: ''});

  const handleInputChange = useInputChangeHandler(setPost);
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  const cropperRef = useRef(null);
  const [fileData, setFileData] = useState(null);
  const [userDataType, setUserDataType] = useState('');
  const [googleDataType, setGoogleDataType] = useState('');
  const sessionId = useContext(SessionContext);

  const buildRequestBody = ({post, imageUrl}) => ({
    username: post.username,
    userImage: imageUrl,
    image: post.image,
  });

  const { handleSubmit, isSubmitting } = useSubmitHandler(
    fileData,
    sessionId,
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
      setUserDataType(data.userImage.split('/')[4]?.split('-')[0])
      setGoogleDataType(data.image.split('/')[2]?.split('.')[0])
    };

    if (userId) getUserData();
  }, [userId]);

  return (
    <section className='w-full max-w-full flex-start flex-col -mt-8 xs:mt-0'>
      <div className='head_text text-start xs:text-5xl xs:-mt-4 mb-4'>
        <span className='orange_gradient'>Edit profile page</span>
      </div>
      <form
        onSubmit={handleSubmit}
        className='p-4 gap-5 glassmorphism w-full flex flex-col xs:flex-row min-h-[400px] h-fit'
      >
        <ImageEditor setFileData={setFileData} dataType={userDataType} googleDataType={googleDataType} post={post} cropperRef={cropperRef}/>

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
