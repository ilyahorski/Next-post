"use client";

import { useRef, useContext, useEffect, useState } from "react";
import CommentMessageForm from "./CommentMessageForm";
import { SocketContext, MessageContext } from "~/utils/context/SocketContext";

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
  
  const { editingMessage, setEditingMessage } = useContext(MessageContext);
  const messageRef = useRef(null);

  const onFormSubmit = async (data, mediaUrls) => {
    let newMessage;
    if (!editingMessage) {
      setNewMessageGet(true);
    }

    if (editingMessage) {
      socket.emit("editMessage", {
        messageId: editingMessage._id,
        newText: data.message,
        chatId: id,
      }, (response) => {
        if (response.status === 'success') {
          console.log("Message updated successfully");
        } else {
          console.error("Failed to update message:", response.error);
        }
      });
      setEditingMessage(null);
    } else if (sessionUserId) {
      newMessage = {
        writerId: sessionUserId,
        chatId: id,
        message: data.message || "",
        media: mediaUrls,
        messageStatus: "sent",
        deletedBy: null,
        replyTo: replyTo ? replyTo._id : null,
      };

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
          } else {
            console.log("Error sending message: ", response.message);
          }
        });

        return () => {
          socket.off("messageSent");
        };
      }
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      setTimeout(() => {
        window.requestAnimationFrame(() => 
          messageEndRef.current.scrollIntoView({
            // behavior: 'smooth',
            block: 'end',
            // block: "start",
            // inline: 'nearest'
          })
        )
      }, 200);
    }
  }, [newMessageGet]);


  return (
    <CommentMessageForm
      type={"message"}
      onFormSubmit={onFormSubmit}
      placeholder={editingMessage ? "Edit message" : "Message"}
      maxLength={4000}
      messageRef={messageRef}
      scrollToBottom={scrollToBottom}
      replyTo={replyTo}
      setReplyTo={setReplyTo}
      initialValue={editingMessage ? editingMessage.message : ""}
    />
  );
};

export default MessageForm;
