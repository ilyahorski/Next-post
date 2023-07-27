'use client'

import Image from "next/image";
import {useEffect, useRef} from "react";

const MessageList = ({ messagesList, isMobile, session }) => {
  const endOfMessages = useRef(null);

  useEffect(() => {
    if (endOfMessages.current) {
      const scrollContainer = endOfMessages.current.parentElement;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messagesList]);

  return (
    <>
      {messagesList.length !== 0 ? (
        <div className='message-list'>
          {messagesList.map((message, index) => (
            <div
              key={message._id + index}
              ref={index === messagesList.length - 1 ? endOfMessages : null}
              className={`flex ${message?.writerId?._id !== session?.user?.id ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`flex items-end gap-2 ${message.writerId._id !== session?.user?.id ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {!isMobile && (
                  <Image
                    src={message.writerId.userImage || message.writerId.image}
                    alt='user_image'
                    width={30}
                    height={30}
                    className='rounded-full object-fill h-[30px] w-[30px]'
                  />
                )}
                <p
                  className={`flex font-inter font-extralight text-3xs px-2 p-1 max-w-[350px] rounded-lg ${message.writerId._id !== session?.user?.id ? 'bg-primary-600 dark:bg-primary-800 text-black dark:text-gray-200' : 'bg-primary-700 dark:bg-primary-900 dark:text-gray-200 text-gray-200'}`}
                >
                  {message.message}
                </p>
              </div>
            </div>
            )
          )}
        </div>
      ) : (
        <div className='message-list'>
          Start chatting or wait for messages to load
        </div>
      )}
    </>
  );
};

export default MessageList;
