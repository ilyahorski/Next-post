'use client'

import Image from "next/image";
import ReactTimeAgo from "react-time-ago";
import {useEffect, useState, useRef, useContext} from "react";
import {localeToFullLocale, supportedLocales} from "~/utils/constants/supportedLocales";
import JavascriptTimeAgo from "javascript-time-ago";
import {LoadingBar} from "~/components/Loading";
import {SocketContext} from "~/utils/context/SocketContext";

JavascriptTimeAgo.addLocale(supportedLocales.en);

const Comments = ({postId, isMain, comments, setComments}) => {
  const [isLoading, setIsLoading] = useState(true)
  const locale = navigator.language;
  const endOfComments = useRef(null);

  const socket = useContext(SocketContext);

  useEffect(() => {
    if (postId && socket && isLoading === true) {
      socket.emit('getComments', {postId});
      setIsLoading(true);

      const handleCommentsReceived = (receivedComments) => {
        setIsLoading(false);
        if (receivedComments.status && receivedComments.status === 'error') {
          console.log('Error getting comments: ', receivedComments.message);
        } else {
          if (receivedComments && receivedComments.length > 0 && receivedComments[0]?.postId === postId) {
            setComments(isMain ? [receivedComments[receivedComments.length - 1]] : receivedComments);
          } else {
            setComments([]);
          }
        }
      };

      const handleNewComment = (comment) => {
        if (comment.postId === postId) {
          setComments((prevComments) => {
            if (!prevComments) return [comment];
            const commentIds = new Set(prevComments.map((c) => c._id));
            if (commentIds.has(comment._id)) {
              return prevComments;
            } else {
              return isMain ? [comment] : [...prevComments, comment];
            }
          });
        }
      };

      socket.on('commentsReceived', handleCommentsReceived);
      socket.on('newComment', handleNewComment);

      return () => {
        socket.off('commentsReceived', handleCommentsReceived);
        socket.off('newComment', handleNewComment);
      };
    }
  }, [socket, postId, isMain, comments, setComments]);

  useEffect(() => {
    if (endOfComments.current) {
      const scrollContainer = endOfComments.current.parentElement;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [comments]);

  if (isLoading) return <LoadingBar isMessage={true} />;

  if (!comments || comments.length === 0) return null;

  return (
    <>
      <div className='comment-list'>
        {comments.map((comment, index) => (
          <div
            key={comment?._id}
            ref={index === comments.length - 1 ? endOfComments : null}
            className={!isMain
              ? 'border-b-[1px] border-black/20 dark:border-white/20 flex flex-row justify-between flex-wrap m-1 items-start gap-2'
              : 'flex flex-row justify-between flex-wrap m-1 items-start gap-2'
            }>
            <div className='flex gap-2 justify-start items-start'>
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

                {comment?.createdAt && (
                  <div className='font-satoshi font-normal text-gray-400 dark:text-gray-400 text-5xs'>
                    <ReactTimeAgo
                      date={new Date(comment?.createdAt).getTime()}
                      locale={locale in supportedLocales ? localeToFullLocale[locale] : 'en-GB'}
                      timeStyle='round'
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Comments;