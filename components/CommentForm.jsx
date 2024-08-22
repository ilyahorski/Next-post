'use client'

import CommentSendForm from "./CommentSendForm";
import {useContext} from "react";
import {SocketContext} from "~/utils/context/SocketContext";

const CommentForm = ({ userId, postId }) => {

  const socket = useContext(SocketContext);

  const onFormSubmit = (data) => {
    if (socket) {
      const commentData = {
        commentatorId: userId,
        postId: postId,
        comment: data.comment
      };

      socket.emit("sendComment", commentData);

      socket.on("commentSent", (response) => {
        if (response.status === "success") {
          console.log("Comment sent successfully");
        } else {
          console.log("Error sending comment: ", response.message);
        }
      });

      return () => {
        socket.off("commentSent");
      };
    } else {
      console.log("Socket is not available");
    }
  };

  return (
    <CommentSendForm
      onFormSubmit={onFormSubmit}
      placeholder="Comment message"
      maxLength={2000}
    />
  );
};

export default CommentForm;
