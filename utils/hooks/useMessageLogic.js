import { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { SocketContext, MessageContext } from "~/utils/context/SocketContext";

export const useMessageLogic = ({ messagesList, sessionUserId }) => {
  const longPressTimer = useRef(null);
  const socket = useContext(SocketContext);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const { selectedMessage, setSelectedMessage, setEditingMessage } =
    useContext(MessageContext);

  const { id: chatId } = useParams();
  const queryClient = useQueryClient();

  // Handle page visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Mark messages as seen
  useEffect(() => {
    if (socket && isPageVisible) {
      const unseenMessages = messagesList.filter(
        (message) =>
          message?.writerId._id !== sessionUserId &&
          message?.messageStatus !== "seen"
      );

      unseenMessages.forEach((message) => {
        socket.emit("markMessageAsSeen", { messageId: message?._id, chatId });
      });
    }
  }, [messagesList, sessionUserId, socket, chatId, isPageVisible]);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectedMessage && !event.target.closest("button")) {
        setSelectedMessage(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedMessage, setSelectedMessage]);

  // Handle socket events for reactions
  useEffect(() => {
    if (socket) {
      socket.on("messageReactionUpdated", (updatedMessage) => {
        queryClient.setQueryData(["messages", chatId], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              usersMessages: page.usersMessages.map((msg) =>
                msg._id === updatedMessage._id
                  ? { ...msg, reactions: updatedMessage.reactions }
                  : msg
              ),
            })),
          };
        });
      });
    }

    return () => {
      if (socket) {
        socket.off("messageReactionUpdated");
      }
    };
  }, [socket, chatId, queryClient]);

  // Scroll to selected message
  useEffect(() => {
    if (selectedMessage) {
      const selectedElement = document.getElementById(
        `message-${selectedMessage._id}`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedMessage]);

  const handleReactionClick = (message, emoji) => {
    const existingReaction = message.reactions?.find((r) => r.emoji === emoji);
    if (existingReaction && existingReaction.users.includes(sessionUserId)) {
      socket.emit("removeReaction", {
        messageId: message._id,
        emoji,
        userId: sessionUserId,
        chatId,
      });
    } else {
      socket.emit("addReaction", {
        messageId: message._id,
        emoji,
        userId: sessionUserId,
        chatId,
      });
    }
  };

  const handleContextMenu = (message, event) => {
    event.preventDefault();
    setSelectedMessage(message);
  };

  const handleTouchStart = (message) => {
    longPressTimer.current = setTimeout(() => {
      setSelectedMessage(message);
    }, 1000);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleReply = (onReply) => {
    if (selectedMessage) {
      onReply(selectedMessage);
      setSelectedMessage(null);
    }
  };

  const handleCopyText = () => {
    if (selectedMessage) {
      navigator.clipboard.writeText(selectedMessage.message);
      setSelectedMessage(null);
    }
  };

  const handleEditMessage = () => {
    if (selectedMessage) {
      setEditingMessage(selectedMessage);
      setSelectedMessage(null);
    }
  };

  const handleDeleteMessage = () => {
    if (selectedMessage) {
      socket.emit("deleteMessage", {
        messageId: selectedMessage._id,
        media: selectedMessage.media,
        chatId,
      });
      setSelectedMessage(null);
    }
  };

  const scrollToMessage = (messageId) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return {
    selectedMessage,
    setSelectedMessage,
    chatId,
    handleReactionClick,
    handleContextMenu,
    handleTouchStart,
    handleTouchEnd,
    handleReply,
    handleCopyText,
    handleEditMessage,
    handleDeleteMessage,
    scrollToMessage,
  };
};
