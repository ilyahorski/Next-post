'use client'

import { useState } from 'react';
import Image from "next/image";
import MessageForm from "~/components/MessageForm";
import {useMobileCheck} from "~/utils/hooks/useMobileCheck";

const Messages = ({chat, user, messages}) => {
  const [sortedMessages, setSortedMessages] = useState(messages);
  const [messageInput, setMessageInput] = useState("");
  const isMobile = useMobileCheck();

  chat.lastMessage = messages[messages.length - 1]._id;

  const sortedAndRenderedMessages = [...sortedMessages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="flex flex-col px-1 pb-3 flex-grow-1 w-full custom-height" >
      <div className='message-list'>
        {sortedAndRenderedMessages.map((message, index) => {
          const sender = user.find(user => user._id === message.writerId);
          return (
            <div
              key={index}
              className={`flex ${message.writerId === 'userid1' ? 'justify-start' : 'justify-end'}`}>
              <div
                className={`flex items-end gap-2 ${message.writerId === 'userid1' ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {!isMobile && (
                  <Image
                    src={sender.userImage}
                    alt='user_image'
                    width={30}
                    height={30}
                    className='rounded-full object-fill h-[30px] w-[30px]'
                  />
                )}
                <p
                  className={`flex p-2 max-w-[350px] border border-gray-500 rounded ${message.writerId === 'userid1' ? 'bg-gray-300 dark:bg-gray-500' : 'bg-primary-300 dark:bg-primary-500'}`}
                >
                  {message.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <MessageForm
        chat={chat}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        sortedMessages={sortedMessages}
        setSortedMessages={setSortedMessages}
      />
    </div>
  );
};

export default Messages;


