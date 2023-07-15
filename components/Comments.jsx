'use client'

import Image from "next/image";
import ReactTimeAgo from "react-time-ago";
import {useEffect, useState} from "react";
import {io} from "socket.io-client";
import {localeToFullLocale, supportedLocales} from "~/utils/constants/supportedLocales";
import JavascriptTimeAgo from "javascript-time-ago";

JavascriptTimeAgo.addDefaultLocale(supportedLocales.en);

const Comments = ({ postId, isMain }) => {
  const [commentsList, setCommentsList] = useState([])

  useEffect(() => {
    const socket = io('https://next-post-bc80bba88d82.herokuapp.com/');

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const socket = io('https://next-post-bc80bba88d82.herokuapp.com/');

    socket.emit('getComments', { postId });

    socket.on('commentsReceived', (comments) => {
      if (comments.status && comments.status === 'error') {
        console.log('Error getting comments: ', comments.message);
      } else {
        console.log('Received comments: ', comments);
        setCommentsList(isMain ? comments[comments.length - 1] : comments)
      }
    });
  }, []);

  return (
    <div
      className='flex-1 break-inside-avoid rounded-lg max-h-[300px] mb-1 overflow-auto border border-gray-300 p-0.5 bg-white/20 bg-clip-padding backdrop-blur-lg backdrop-filter w-full h-fit;'>
      {commentsList.map((comment) => (
        <div key={comment.commentatorId._id} className='flex flex-row justify-between flex-wrap m-1 items-start gap-2 border-b-[1px] border-primary-300 '>
          <div
            className='flex gap-2 justify-start items-start'
          >
            <div className='flex h-[40px] min-w-[41px] pt-0.5'>
              <Image
                src={comment.commentatorId.userImage || comment.commentatorId.userImage}
                alt='user_image'
                width={40}
                height={40}
                className='rounded-full object-fill h-[40px] w-[40px]'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <h3 className='font-satoshi font-semibold text-gray-600 text-sm'>
                {comment.commentatorId.username}
              </h3>
              <div className='flex overflow-auto justify-start items-center '>
                <p className='font-satoshi font-normal text-gray-800 text-4xs'>
                  {comment.comment}
                </p>
              </div>

              <div className='font-satoshi font-normal text-gray-400 text-5xs'>
                <ReactTimeAgo
                  date={new Date(comment.createdAt).getTime()}
                  locale={locale in supportedLocales ? localeToFullLocale[locale] : 'en-GB'}
                  timeStyle='round' />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Comments;
