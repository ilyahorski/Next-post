'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactTimeAgo from 'react-time-ago';
import Image from 'next/image';
import { supportedLocales, localeToFullLocale } from '@/utils/constants/supportedLocales';
import Loading from '@/app/loading';
import { parseTags } from '@/utils/tagStringToArray';

const Post = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams.get('id');
  const [post, setPost] = useState(
    { prompt: '', tags: '', image: '', creator: '', createdAt: '' },
  );
  const [tags, setTags] = useState(null);
  const locale = navigator.language;

  useEffect(() => {
    const getPromptDetails = async () => {
      const response = await fetch(`/api/prompt/${promptId}`);
      const data = await response.json();

      setPost({
        prompt: data.prompt,
        tags: data.tag,
        image: data.image,
        creator: data.creator,
        createdAt: data.createdAt,
      });
      setTags(parseTags(data.tag));
    };

    if (promptId) getPromptDetails();

  }, []);

  return (
    <>
      {post.prompt ? (
        <div
          className='flex-1 break-inside-avoid rounded-lg border border-gray-300 bg-white/40 bg-clip-padding p-6 backdrop-blur-lg backdrop-filter w-full h-fit;'>
          <div className='flex justify-between p-2 mb-4 items-center gap-5 border-gray-200 border-2 rounded-lg'>
            <div
              className='flex-1 flex justify-start items-center gap-3 cursor-pointer'
            >
              <Image
                src={post.creator.image}
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
            <div className='flex justify-center items-center font-inter text-sm text-gray-500'>
              <div>
                <p>Post created</p>
                <ReactTimeAgo
                  date={new Date(post.createdAt).getTime()}
                  locale={locale in supportedLocales ? localeToFullLocale[locale] : 'en-GB'}
                  timeStyle='round' />
              </div>
            </div>
          </div>

          <div>
            <div className='relative my-0.5 w-full h-[500px] border-gray-200 border-2 bg-amber-50 rounded-lg'>
              <Image
                style={{ objectFit: 'contain' }}
                src={post.image}
                alt='image'
                fill={true}
                quality={100}
              />
            </div>
            <p className='my-4 font-satoshi text-[16px] text-gray-700'>{post.prompt}</p>
            <div className='flex justify-between items-center gap-1.5'>
              {tags.map((tag, i) => (
                <p
                  key={i}
                  // title={`Click to find all ${tag} posts`}
                  className='font-inter text-sm blue_gradient cursor-pointer'
                >
                  {tag}
                </p>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )
      }
    </>
  );
};

export default Post;
