"use client";

import { useRef, useContext, useEffect, useState } from "react";
import CommentMessageForm from "./CommentMessageForm";
import { SocketContext } from "~/utils/context/SocketContext";

const MessageForm = ({
  id,
  chat,
  sessionUserId,
  scrollToBottom,
  replyTo,
  setReplyTo,
  messageEndRef,
}) => {
  const [newMessageGet, setNewMessageGet] = useState(false);
  const socket = useContext(SocketContext);
  const messageRef = useRef(null);
  const behavior = navigator.userAgent.includes('Chrome') ? 'auto' : 'smooth'

  const onFormSubmit = async (data, mediaUrls) => {
    let newMessage;
    setNewMessageGet(true);

    if (sessionUserId) {
      newMessage = {
        writerId: sessionUserId,
        chatId: id,
        message: data.message || "",
        media: mediaUrls,
        messageStatus: "sent",
        deletedBy: null,
        replyTo: replyTo ? replyTo._id : null,
      };
    }

    if (socket) {
      socket.emit("sendMessage", newMessage);
      setReplyTo(null);

      socket.on("messageSent", async (response) => {
        if (response.status === "success") {
          setNewMessageGet(false);
          const chatData = {
            chatId: chat._id,
            chatName: chat.chatName,
            chatImage: chat.chatImage,
            lastMessage: response?.newMessage._id,
          };

          const fetchResponse = await fetch(
            `/api/chats/${response.newMessage.chatId}`,
            {
              method: "PATCH",
              body: JSON.stringify(chatData),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          // if (!fetchResponse.ok) {
          //   throw new Error('Failed to update chat');
          // }
        } else {
          console.log("Error sending message: ", response.message);
        }
      });

      return () => {
        socket.off("messageSent");
      };
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      window.requestAnimationFrame(() => 
        messageEndRef.current.scrollIntoView({
          behavior: behavior,
          block: "end",
          inline: "end",
        })
      )
    }
  }, [newMessageGet]);

  return (
    <CommentMessageForm
      type={"message"}
      onFormSubmit={onFormSubmit}
      placeholder="Message"
      maxLength={4000}
      messageRef={messageRef}
      scrollToBottom={scrollToBottom}
      replyTo={replyTo}
      setReplyTo={setReplyTo}
    />
  );
};

export default MessageForm;
