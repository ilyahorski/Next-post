'use client'

import {io} from "socket.io-client";
import CommentMessageForm from "./CommentMessageForm";

const CommentForm = ({ userId, postId }) => {

  const onFormSubmit = (data) => {
    const commentData = {
      commentatorId: userId,
      postId: postId,
      comment: data.message
    };

    const socket = io('https://next-post-bc80bba88d82.herokuapp.com/');

    socket.emit('sendComment', commentData);

    socket.on('commentSent', (response) => {
      if (response.status === 'success') {
        console.log('Comment sent successfully');
      } else {
        console.log('Error sending comment: ', response.message);
      }
    });
  };

  return (
    <CommentMessageForm
      type={'comment'}
      onFormSubmit={onFormSubmit}
      placeholder="Comment message"
      maxLength={2000}
    />
  );
};

export default CommentForm;
