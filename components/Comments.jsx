'use client'

import Image from "next/image";
import ReactTimeAgo from "react-time-ago";
import {useEffect, useState, useRef, useContext} from "react";
import {localeToFullLocale, supportedLocales} from "~/utils/constants/supportedLocales";
import JavascriptTimeAgo from "javascript-time-ago";
import {LoadingBar} from "~/components/Loading";
import {SocketContext} from "~/utils/context/SocketContext";

JavascriptTimeAgo.addDefaultLocale(supportedLocales.en);

const Comments = ({postId, isMain}) => {
  const [commentsList, setCommentsList] = useState([])
  const locale = navigator.language;
  const endOfComments = useRef(null);

  const socket = useContext(SocketContext);

  useEffect(() => {
    if (postId && socket) {
      socket.emit('getComments', {postId});

      socket.on('commentsReceived', (comments) => {
        if (comments.status && comments.status === 'error') {
          console.log('Error getting comments: ', comments.message);
        } else {
          if (comments && comments.length > 0) {
            setCommentsList((prevComments) => {
              if (comments[0].postId === postId) {
                return isMain ? [comments[comments.length - 1]] : comments;
              } else {
                return prevComments;
              }
            });
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

      return () => {
        socket.off('commentsReceived');
        socket.off('newComment');
      };
    }
  }, [socket, postId]);

  useEffect(() => {
    if (endOfComments.current) {
      const scrollContainer = endOfComments.current.parentElement;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [commentsList]);

  return (
    <>
      {commentsList[0] ? (
        <div
          className='comment-list'>
          {commentsList.map((comment, index) => (
            <div
              key={comment?._id}
              ref={index === commentsList.length - 1 ? endOfComments : null}
              className={!isMain
                ?
                'border-b-[1px] border-black/20 dark:border-white/20 flex flex-row justify-between flex-wrap m-1 items-start gap-2'
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
                  <h3 className='font-satoshi font-semibold text-gray-600 dark:text-gray-400 text-sm'>
                    {comment?.commentatorId?.username}
                  </h3>
                  <div className='flex overflow-auto justify-start items-center '>
                    <p className='font-satoshi font-normal text-gray-800 dark:text-gray-300 text-4xs'>
                      {comment?.comment}
                    </p>
                  </div>

                  <div className='font-satoshi font-normal text-gray-400 dark:text-gray-400 text-5xs'>
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
      ) : (<LoadingBar isMessage={true} />)}
    </>
  );
};

export default Comments;
