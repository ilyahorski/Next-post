'use client'

import { useRef, useContext } from "react";
import CommentMessageForm from "./CommentMessageForm";
import {SocketContext} from "~/utils/context/SocketContext";

const MessageForm = ({ id, chat, sessionUserId, formEndRef, scrollToBottom }) => {
  const socket = useContext(SocketContext);
  const messageRef = useRef(null);

  const onFormSubmit = async (data, mediaUrls) => {
    let newMessage

    if (sessionUserId) {
      newMessage = {
        writerId: sessionUserId,
        chatId: id,
        message: data.message || '',
        media: mediaUrls,
        messageStatus: 'sent',
        deletedBy: null,
      };
    }

    if(socket) {
      socket.emit('sendMessage', newMessage);

      socket.on('messageSent', async (response) => {
        if (response.status === 'success') {
          const chatData = {
            chatName: chat.chatName,
            chatImage: chat.chatImage,
            lastMessage: response?.newMessage._id
          };

          const fetchResponse = await fetch(`/api/chats/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(chatData),
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (!fetchResponse.ok) {
            throw new Error('Failed to update chat');
          }

        } else {
          console.log('Error sending message: ', response.message);
        }
      });

      return () => {
        socket.off('messageSent');
      };
    }
  };

  return (
    <CommentMessageForm
      type={'message'}
      onFormSubmit={onFormSubmit}
      placeholder="Message"
      maxLength={4000}
      messageRef={messageRef}
      formEndRef={formEndRef}
      scrollToBottom={scrollToBottom}
    />
  );
};

export default MessageForm;