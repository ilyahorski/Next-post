'use client'

import CommentMessageForm from "./CommentMessageForm";
import {useContext} from "react";
import {SocketContext} from "~/utils/context/SocketContext";

const MessageForm = ({ id, chat, session }) => {
  const socket = useContext(SocketContext);

  const onFormSubmit = async (data) => {
    let newMessage

    if (session.user) {
      newMessage = {
        writerId: session?.user?.id,
        chatId: id,
        message: data.message,
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
    />
  );
};

export default MessageForm;
