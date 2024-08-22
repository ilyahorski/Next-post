import Image from "next/image";
import { useEffect, useRef, useState, useContext } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "@tanstack/react-query";
import MediaGrid from "./MediaGrid";
import EmojiPickerComponent from "./EmojiPickerComponent";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SocketContext, MessageContext } from "~/utils/context/SocketContext";
import {
  IoCheckmarkOutline,
  IoCheckmarkDoneOutline,
  IoTrashOutline,
  IoPencilOutline,
} from "react-icons/io5";
import { IoMdCopy } from "react-icons/io";
import { GoReply } from "react-icons/go";
import { twMerge } from "tailwind-merge";

const VideoEmbed = ({ url }) => {
  const [tiktokLoaded, setTiktokLoaded] = useState(false);

  const getEmbedInfo = (url) => {
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|shorts\/)?([a-zA-Z0-9_-]+)/;
    const tiktokRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:tiktok\.com)\/@([\w.-]+)\/video\/(\d+)/;

    const youtubeMatch = url.match(youtubeRegex);
    const tiktokMatch = url.match(tiktokRegex);

    if (youtubeMatch) {
      return {
        type: "youtube",
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
      };
    }
    if (tiktokMatch) {
      return { type: "tiktok", videoId: tiktokMatch[2] };
    }

    return { type: "unknown" };
  };

  const { type, embedUrl, videoId } = getEmbedInfo(url);

  useEffect(() => {
    if (type === "tiktok") {
      const script = document.createElement("script");
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      script.onload = () => setTiktokLoaded(true);
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [type]);

  const renderEmbed = () => {
    switch (type) {
      case "youtube":
        return (
          <>
            <iframe
              width="100%"
              height="315"
              src={embedUrl}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <Link href={url} className="text-blue-500 underline">
              {url}
            </Link>
          </>
        );
      case "tiktok":
        return (
          <>
            {tiktokLoaded ? (
              <blockquote
                className="tiktok-embed"
                cite={url}
                data-video-id={videoId}
                style={{ maxWidth: "605px", minWidth: "325px" }}
              >
                <section>
                  <a
                    target="_blank"
                    title="@username"
                    href={`https://www.tiktok.com/@username`}
                  >
                    @username
                  </a>
                </section>
              </blockquote>
            ) : (
              <div> TikTok loaded...</div>
            )}
            <Link href={url} className="text-blue-500 underline">
              {url}
            </Link>
          </>
        );
      default:
        return (
          <Link href={url} className="text-blue-500 underline">
            {url}
          </Link>
        );
    }
  };

  return <div className="max-w-[300px]">{renderEmbed()}</div>;
};

const renderMessageWithLinks = (message) => {
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  return message?.split(urlPattern).map((part, index) => {
    if (urlPattern.test(part)) {
      return <VideoEmbed key={index} url={part} />;
    }
    return part;
  });
};

const MessageList = ({
  messagesList,
  isMobile,
  sessionUserId,
  onReply,
  messageEndRef,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const longPressTimer = useRef(null);
  const socket = useContext(SocketContext);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const { selectedMessage, setSelectedMessage, setEditingMessage } =
    useContext(MessageContext);

  const { id: chatId } = useParams();
  const queryClient = useQueryClient();

  const messageListRef = useRef(null);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // useEffect(() => {
  //   if (selectedMessage) {
  //     const selectedElement = document.getElementById(`message-${selectedMessage._id}`);
  //     if (selectedElement && messageListRef.current) {
  //       const containerRect = messageListRef.current.getBoundingClientRect();
  //       const selectedRect = selectedElement.getBoundingClientRect();

  //       // Высота меню с кнопками и эмодзи баром
  //       const menuHeight = 300;

  //       // Проверяем, достаточно ли места для отображения меню
  //       const spaceBelow = containerRect.bottom - selectedRect.bottom;

  //       if (spaceBelow < menuHeight) {
  //         // Если места недостаточно, прокручиваем контейнер
  //         const scrollAmount = menuHeight - spaceBelow + 50; // 20px дополнительно для отступа
  //         messageListRef.current.scrollTop += scrollAmount; // Используем отрицательное значение, так как контейнер перевернут
  //       }
  //     }
  //   }
  // }, [selectedMessage]);

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

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

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
  }, [selectedMessage]);

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

  const renderReactions = (message) => {
    if (!message.reactions || message.reactions.length === 0) return null;

    return (
      <div className="flex min-w-[50px] -mb-2 gap-1">
        {message.reactions.map((reaction) => (
          <button
            key={reaction.emoji}
            onClick={() => handleReactionClick(message, reaction.emoji)}
            className={`flex items-center bg-transparent px-1 py-1 text-xs ${
              reaction.users.includes(sessionUserId) ? "bg-blue-500" : ""
            }`}
          >
            <span className="text-[14px] mr-1">{reaction.emoji}</span>
            <span className="text-[14px]">{reaction.users.length}</span>
          </button>
        ))}
      </div>
    );
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

  const handleReply = () => {
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

  const handlePinMessage = () => {
    // Function to handle message pinning
  };

  const scrollToMessage = (messageId) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const renderReplyPreview = (replyToMessage) => {
    if (!replyToMessage) return null;

    return (
      <div
        className="bg-zinc-900 p-2 rounded-lg cursor-pointer max-w-[300px] no-select w-full mr-8"
        onClick={() => scrollToMessage(replyToMessage.replyTo._id)}
      >
        <p className="text-sm text-gray-100">
          Reply to {replyToMessage.replyTo?.writerId?.username}
        </p>
        <p className="text-sm truncate">
          {replyToMessage.replyTo?.message || "Media"}
        </p>
      </div>
    );
  };

  const renderMessageStatus = (message) => {
    if (message?.writerId._id === sessionUserId) {
      switch (message?.messageStatus) {
        case "sent":
          return (
            <p className="text-white">
              <IoCheckmarkOutline />
            </p>
          );
        case "delivered":
          return (
            <p className="text-white">
              <IoCheckmarkDoneOutline />
            </p>
          );
        case "seen":
          return (
            <p className="text-teal-500">
              <IoCheckmarkDoneOutline />
            </p>
          );
        default:
          return "";
      }
    }
    return null;
  };

  const renderMessageMenu = (message) => {
    if (selectedMessage && selectedMessage._id === message._id) {
      return (
        <div
          style={{ touchAction: "none", bottom: 0 }}
          className={`flex flex-col items-center justify-center gap-1 w-72 absolute z-8000
                    ${
                      message?.writerId._id !== sessionUserId
                        ? " left-[30px]"
                        : " right-[30px]"
                    }`}
        >
          <div
            className={`no-select flex flex-col w-48 gap-3 items-center justify-center rounded-md bg-zinc-900/70 backdrop-blur-sm p-2`}
          >
            <button
              style={{ touchAction: "none" }}
              onClick={handleReply}
              className="no-select flex items-center justify-between gap-3 w-full"
            >
              <GoReply className="w-3/12 h-5 text-white" />
              <p className="flex items-center justify-start text-[14px] w-9/12">
                Reply
              </p>
            </button>
            <button
              style={{ touchAction: "none" }}
              onClick={handleCopyText}
              className="no-select flex items-center justify-between gap-3 w-full"
            >
              <IoMdCopy className="w-3/12 h-5 text-white" />
              <p className="flex items-center justify-start text-[14px] w-9/12">
                Copy text
              </p>
            </button>
            {selectedMessage.writerId._id === sessionUserId && (
              <button
                style={{ touchAction: "none" }}
                onClick={handleEditMessage}
                className="no-select flex items-center justify-between gap-3 w-full"
              >
                <IoPencilOutline className="w-3/12 h-5 text-white" />
                <p className="flex items-center justify-start text-[14px] w-9/12">
                  Edit
                </p>
              </button>
            )}
            <button
              style={{ touchAction: "none" }}
              onClick={handleDeleteMessage}
              className="no-select flex items-center justify-between gap-3 w-full"
            >
              <IoTrashOutline className="w-3/12 h-5 text-white" />
              <p className="flex items-center justify-start text-[14px] w-9/12">
                Delete
              </p>
            </button>
          </div>
          <div className="flex w-80 z-5000">
            {chatId && (
              <EmojiPickerComponent
                setSelectedMessage={setSelectedMessage}
                messageId={message._id}
                userId={sessionUserId}
                chatId={chatId}
              />
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderMessage = (message, index, isSameDayAsNext, chatId) => {
    const hasLongWord = message?.message
      .split(/\s+/)
      .some((word) => word.length > 16);

    return (
      <div
        className="relative"
        key={message?._id + index}
        id={`message-${message?._id}`}
        onContextMenu={(e) => handleContextMenu(message, e)}
        onTouchStart={() => handleTouchStart(message)}
        onTouchEnd={handleTouchEnd}
      >
        {!isSameDayAsNext && (
          <div className="no-select flex w-full justify-center">
            <div className=" flex max-w-fit text-center font-normal text-[14px] my-2 dark:text-white px-2 py-1 bg-slate-800 bg-opacity-70 rounded-lg">
              {format(parseISO(message?.createdAt), "PPP")}
            </div>
          </div>
        )}
        {message?.writerId?._id && (
          <div
            className={`flex relative ${
              message?.writerId?._id !== sessionUserId
                ? "justify-start"
                : "justify-end"
            }`}
          >
            <div
              className={`flex items-end gap-2 relative ${
                message?.writerId?._id !== sessionUserId
                  ? "flex-row"
                  : "flex-row-reverse"
              }`}
            >
              {!isMobile && (
                <Image
                  src={message?.writerId.userImage || message?.writerId.image}
                  alt="user_image"
                  width={30}
                  height={30}
                  className="rounded-full object-fill h-[30px] w-[30px]"
                />
              )}
              <div
                className={twMerge(`no-select flex flex-col relative gap-1 rounded-lg w-11/12
                ${message?.media ? "p-2" : "px-1 py-2"} 
                ${
                  message?.writerId._id !== sessionUserId
                    ? " bg-secondary-700 text-gray-200 rounded-bl-none"
                    : " bg-secondary-800 text-gray-200  rounded-br-none"
                }`)}
              >
                {message?.replyTo && renderReplyPreview(message)}

                {message?.media && <MediaGrid media={message?.media} />}

                <div className="flex flex-col w-full no-select">
                  <div
                    className={`${
                      !message?.message && "hidden"
                    } w-full min-w-[70px] max-w-[700px] px-2 pb-2 whitespace-pre-wrap font-inter font-extralight text-3xs ${
                      hasLongWord ? "break-all" : "break-normal"
                    } flex-grow`}
                  >
                    {renderMessageWithLinks(message?.message)}
                  </div>
                  <div className="flex justify-end">
                    {renderReactions(message)}
                    <div
                      className={twMerge(
                        `flex w-[50px] justify-end items-end -mb-2 -mr-1`
                      )}
                    >
                      <span
                        className={`flex font-normal text-[10px] h-4 text-gray-100 min-w-[28px]`}
                      >
                        {format(parseISO(message?.createdAt), "HH:mm")}
                      </span>
                      <div className="flex items-center justify-center text-[14px] h-4">
                        {renderMessageStatus(message)}
                      </div>
                    </div>
                  </div>
                </div>
                {renderMessageMenu(message)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={messageListRef}
        className="flex flex-grow overflow-y-auto -mb-2 scrollableDiv"
        style={{
          height: "calc(100vh - 190px)",
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        {messagesList.length !== 0 && sessionUserId ? (
          <div className={`message-list pb-2`}>
            {messagesList.map((message, index) => {
              const isSameDayAsNext =
                index < messagesList.length - 1 &&
                isSameDay(
                  parseISO(message?.createdAt),
                  parseISO(messagesList[index + 1].createdAt)
                );
              return renderMessage(message, index, isSameDayAsNext, chatId);
            })}
            {isFetchingNextPage && <div>Loading more...</div>}
            <div ref={ref} className="h-0.5 border-2 border-transparent" />
          </div>
        ) : (
          <div className="message-list">
            Start chatting or wait for messages to load
          </div>
        )}
      </div>
      <div className="h-1" />
      <div ref={messageEndRef} className="h-0.5" />
    </div>
  );
};

export default MessageList;
