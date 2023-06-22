'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {getProviders, useSession} from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { parseTags } from '@/utils/tagStringToArray';
import axios from 'axios';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as Heart } from '@heroicons/react/24/solid';
import Sceleton from "@/components/Sceleton";
import { toggleLike } from "@/utils/toggleLike";

const PostCard = ({ post, handleEdit, handleDelete, handleTagClick }) => {
  const { data: session, status } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState('');
  const [providers, setProviders] = useState(null);

  const tags = parseTags(post.tag);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, [session]);

  useEffect(() => {
    if (status === 'loading' || !session) return;

    axios.get(`/api/like/${post._id}`)
      .then(response => {
        setLikes(response.data.likesCount);
      })
      .catch(error => console.error(error));

    axios.get(`/api/like/${post._id}/${session?.user?.id}`)
      .then(response => {
        if (response.data === 'Like exists') {
          setLiked(true);
        }
      })
      .catch(error => console.error(error));

  }, [post._id, status, session]);

  const handleProfileClick = () => {
    if (post.creator._id === session?.user?.id) return router.push('/profile');

    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
  };

  const handleCopy = () => {
    setCopied(`https://next-post-two.vercel.app//post/${post.creator.username}?id=${post._id}`);
    navigator.clipboard.writeText(`https://next-post-two.vercel.app//post/${post.creator.username}?id=${post._id}`);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePostOpen = (post) => {
    router.push(`/post/${post.creator.username}?id=${post._id}`);
  };

  return (
    <>
      {post && providers ? (
        <div className='post_card'>
          <div className='flex justify-between items-start gap-5'>
            <div
              title='Click to open creator profile'
              className='flex-1 flex justify-start items-center gap-3 cursor-pointer'
              onClick={handleProfileClick}
            >
              <Image
                src={post.creator.image}
                alt='user_image'
                width={40}
                height={40}
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

            <div className='copy_btn' onClick={() => handleCopy}>
              <Image
                src={
                  copied
                    ? '/assets/icons/tick.svg'
                    : '/assets/icons/copy.svg'
                }
                alt={copied ? 'tick_icon' : 'copy_icon'}
                width={12}
                height={12}
              />
            </div>
          </div>

          <div>
            <div title='Click to open a post page'
                 onClick={() => handlePostOpen(post)}
                 className='relative my-4 w-full h-[300px] border-gray-200 border-2 bg-amber-50 rounded-lg cursor-pointer'>
              <Image
                style={{ objectFit: 'contain' }}
                src={post.image}
                alt='image'
                fill={true}
                quality={50}
                sizes="(min-width: 66em) 33vw, (min-width: 44em) 50vw, 100vw"
              />
            </div>
            <p
              className='my-4 font-satoshi text-sm text-gray-700'>{post.post}</p>
            <div className='flex items-start justify-between'>
              <div className='flex flex-wrap items-center gap-2'>
                {tags.map((tag, i) => (
                  <p
                    key={i}
                    title={`Click to find all ${tag} posts`}
                    className='font-inter text-sm blue_gradient cursor-pointer'
                    onClick={() => handleTagClick && handleTagClick(tag)}
                  >
                    {tag}
                  </p>
                ))}
              </div>
              <div className='flex items-center gap-2'>
                <p className='font-satoshi text-[16px] text-gray-700'>
                  {likes}
                </p>
                <button onClick={() => toggleLike({id: post._id, session: session?.user?.id, setLikes: setLikes, setLiked: setLiked})}>
                  {liked ? <Heart className='h-6 w-6 text-red-500 ' /> :
                    <HeartIcon className='h-6 w-6 ' />}
                </button>
              </div>
            </div>
          </div>

          {session?.user?.id === post.creator._id && /^\/profile/.test(pathName) && (
            <div className='mt-5 flex-center gap-4 border-t border-gray-100 pt-3'>
              <button
                className='font-inter text-sm green_gradient cursor-pointer'
                onClick={handleEdit}
              >
                Edit
              </button>
              <button
                className='font-inter text-sm orange_gradient cursor-pointer'
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ) : (
        <Sceleton />
      )
      }
    </>
  );
};

export default PostCard;
