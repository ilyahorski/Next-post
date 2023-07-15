'use client'

import Image from "next/image";
import ReactTimeAgo from "react-time-ago";
import {useEffect, useState, useRef} from "react";
import {io} from "socket.io-client";
import {localeToFullLocale, supportedLocales} from "~/utils/constants/supportedLocales";
import JavascriptTimeAgo from "javascript-time-ago";

JavascriptTimeAgo.addDefaultLocale(supportedLocales.en);

const Comments = ({postId, isMain}) => {
  const [commentsList, setCommentsList] = useState([])
  const locale = navigator.language;
  const endOfComments = useRef(null);

  const socket = io('https://next-post-bc80bba88d82.herokuapp.com/');

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (postId) {
      socket.emit('getComments', {postId});
    }

    socket.on('commentsReceived', (comments) => {
      if (comments.status && comments.status === 'error') {
        console.log('Error getting comments: ', comments.message);
      } else {
        console.log('Received comments: ', comments);
        if (comments && comments.length > 0) {
          setCommentsList(isMain ? [comments[comments.length - 1]] : comments);
        }
      }
    });

    socket.on('newComment', (comment) => {
      if (comment.postId === postId) {
        setCommentsList((prevComments) => {
          const commentIds = new Set(prevComments.map((c) => c._id));
          if (commentIds.has(comment._id)) {
            return prevComments;
          } else {
            return isMain ? [comment] : [...prevComments, comment];
          }
        });
      }
    });

    // Отключение сокета и удаление слушателей при размонтировании
    return () => {
      socket.off('commentsReceived');
      socket.off('newComment');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (endOfComments.current) {
      const scrollContainer = endOfComments.current.parentElement;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [commentsList]);

  return (
    <>
      {commentsList ? (
        <div
          className='flex-1 break-inside-avoid rounded-lg max-h-[300px] mb-1 overflow-auto border border-gray-300 p-0.5 bg-white/20 bg-clip-padding backdrop-blur-lg backdrop-filter w-full h-fit;'>
          {commentsList.map((comment, index) => (
            <div
              key={comment?._id}
              ref={index === commentsList.length - 1 ? endOfComments : null}
              className={!isMain
                ?
                'border-b-[1px] border-primary-300 flex flex-row justify-between flex-wrap m-1 items-start gap-2'
                :
                'flex flex-row justify-between flex-wrap m-1 items-start gap-2'
            }>
              <div
                className='flex gap-2 justify-start items-start'
              >
                <div className='flex h-[40px] min-w-[41px] pt-0.5'>
                  <Image
                    src={comment?.commentatorId?.userImage || comment?.commentatorId?.image}
                    alt='user_image'
                    width={40}
                    height={40}
                    className='rounded-full object-fill h-[40px] w-[40px]'
                  />
                </div>

                <div className='flex flex-col gap-1'>
                  <h3 className='font-satoshi font-semibold text-gray-600 text-sm'>
                    {comment?.commentatorId?.username}
                  </h3>
                  <div className='flex overflow-auto justify-start items-center '>
                    <p className='font-satoshi font-normal text-gray-800 text-4xs'>
                      {comment?.comment}
                    </p>
                  </div>

                  <div className='font-satoshi font-normal text-gray-400 text-5xs'>
                    <ReactTimeAgo
                      date={new Date(comment?.createdAt).getTime()}
                      locale={locale in supportedLocales ? localeToFullLocale[locale] : 'en-GB'}
                      timeStyle='round'/>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (<></>)}
    </>
  );
};

export default Comments;
