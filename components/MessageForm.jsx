'use client'

import {io} from "socket.io-client";
import CommentMessageForm from "./CommentMessageForm";

const MessageForm = ({ chat, messageInput, setMessageInput, sortedMessages, setSortedMessages }) => {

  // const onFormSubmit = (data) => {
  //   const commentData = {
  //     commentatorId: userId,
  //     postId: postId,
  //     comment: data.message
  //   };
  //
  //   const socket = io('https://next-post-bc80bba88d82.herokuapp.com/');
  //
  //   socket.emit('sendComment', commentData);
  //
  //   socket.on('commentSent', (response) => {
  //     if (response.status === 'success') {
  //       console.log('Comment sent successfully');
  //     } else {
  //       console.log('Error sending comment: ', response.message);
  //     }
  //   });
  // };

  const onFormSubmit = (event) => {
    event.preventDefault();
    const newMessage = {
      _id: `messageid${sortedMessages.length}`,
      writerId: 'userid1',
      chatId: chat._id,
      message: messageInput,
      messageStatus: 'sent',
      deletedBy: null,
      createdAt: new Date(),
    };
    setSortedMessages([...sortedMessages, newMessage]);
    setMessageInput("");
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
