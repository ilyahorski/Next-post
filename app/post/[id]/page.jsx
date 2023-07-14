'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactTimeAgo from 'react-time-ago';
import Image from 'next/image';
import { supportedLocales, localeToFullLocale } from '~/utils/constants/supportedLocales';
import Loading from "~/utils/loading";
import { parseTags } from '~/utils/tagStringToArray';
import { HeartIcon as Heart } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { ToastContainer } from "react-toastify";
import { toggleLike } from "~/utils/toggleLike";
import {io} from "socket.io-client";

const Post = () => {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const postIds = searchParams.get('id');
  const [post, setPost] = useState(
    { post: '', tags: '', image: '', creator: '', createdAt: '' },
  );
  const [tags, setTags] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const locale = navigator.language;

  useEffect(() => {
    const socket = io('https://next-post-bc80bba88d82.herokuapp.com/');

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (status === 'loading' || !session) return;

    const socket = io('https://next-post-bc80bba88d82.herokuapp.com/');

    socket.on('likesUpdated', ({ postId, likesCount }) => {
      if (postId === postIds) {
        setLikes(likesCount);
      }
    });

    socket.on('likeStatus', ({ postId, liked }) => {
      if (postId === postIds) {
        setLiked(liked);
      }
    });

    socket.on('connect', () => {
      socket.emit('checkLikeStatus', { userId: session.user.id, postId: postIds });
    });

    return () => socket.disconnect();
  }, [postIds, session, status, likes]);

  useEffect(() => {
    if (status === 'loading') return;
    const getPostDetails = async () => {
      const response = await fetch(`/api/post/${postIds}`);
      const data = await response.json();

      setPost({
        post: data.post,
        tags: data.tag,
        image: data.image,
        creator: data.creator,
        createdAt: data.createdAt,
      });
      setTags(parseTags(data.tag));
    };

    if (postIds) getPostDetails();

  }, [status]);

  return (
    <>
      {post.post ? (
        <>
          <ToastContainer />
          <div
            className='flex-1 p-3 break-inside-avoid rounded-lg border border-gray-300 bg-white/40 bg-clip-padding backdrop-blur-lg backdrop-filter w-full h-fit;'>
            <div className='flex justify-between flex-wrap p-2 mb-4 items-center gap-6 border-gray-200 border-2 rounded-lg'>
              <div
                className='flex-1 overflow-auto flex justify-start items-center gap-3'
              >
                <Image
                  src={post.creator.userImage ? post.creator.userImage : post.creator.image}
                  alt='user_image'
                  width={50}
                  height={50}
                  className='rounded-full object-contain'
                />

                <div className='flex flex-col'>
                  <h3 className='font-satoshi font-semibold text-gray-900'>
                    {post.creator.username}
                  </h3>
                  <p className='font-inter text-sm text-gray-500'>
                    {post.creator.email}
                  </p>
                </div>
              </div>
              <div className='flex h-12 justify-center items-start font-inter text-sm text-gray-700'>
                <ReactTimeAgo
                  date={new Date(post.createdAt).getTime()}
                  locale={locale in supportedLocales ? localeToFullLocale[locale] : 'en-GB'}
                  timeStyle='round' />
              </div>
            </div>

            <div>
              <div className='relative flex justify-center my-4 w-full h-[450px] xs:h-[600px] rounded-lg'>
                <Image
                  style={{ objectFit: 'contain' }}
                  src={post.image}
                  alt='image'
                  fill={true}
                  quality={100}
                />
              </div>
              <div>
                <p className='my-4 pb-2 border-b-[1px] border-gray-400 font-satoshi text-[16px] text-gray-700'>{post.post}</p>
                <div className='flex items-start justify-between'>
                  <div className='flex flex-wrap items-center gap-2'>
                    {tags.map((tag, i) => (
                      <p
                        key={i}
                        className='font-inter text-sm blue_gradient cursor-pointer'
                      >
                        {tag}
                      </p>
                    ))}
                  </div>
                  <div className='flex items-center gap-2'>
                    <p className='font-satoshi text-[16px] text-gray-700'>
                      {likes}
                    </p>
                    <button onClick={() => toggleLike({id: postIds, session: session?.user?.id, setLikes: setLikes, setLiked: setLiked})}>
                      {liked ? <Heart className='h-6 w-6 text-red-500 ' /> :
                        <HeartIcon className='h-6 w-6 ' />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )
      }
    </>
  );
};

export default Post;
