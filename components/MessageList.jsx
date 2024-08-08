import Image from "next/image";
import { useEffect, useRef, useContext, useState } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import MediaGrid from "./MediaGrid";
import Link from "next/link";
import { SocketContext } from "~/utils/context/SocketContext";
import {
  IoCheckmarkOutline,
  IoCheckmarkDoneOutline,
  IoTrashOutline,
  IoPencilOutline,
  IoPinOutline,
} from "react-icons/io5";
import { IoMdCopy } from "react-icons/io";
import { GoReply } from "react-icons/go";
import { twMerge } from "tailwind-merge";

const VideoEmbed = ({ url }) => {
  const getEmbedUrl = (url) => {
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/;
    const youtubeShortsRegex =
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/;

    if (youtubeShortsRegex.test(url)) {
      return null;
    }
    const match = url.match(youtubeRegex);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    // Add more video platform checks here if needed
    return null;
  };

  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) {
    return (
      <Link href={url} className="text-blue-500 underline">
        {url}
      </Link>
    );
  }

  return (
    <div className="max-w-[300px]">
      <iframe
        width="100%"
        // height="315"
        src={embedUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <Link href={url} className="text-blue-500 underline">
        {url}
      </Link>
    </div>
  );
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
  chatId,
  sessionUserId,
  onReply,
  messageEndRef,
}) => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const longPressTimer = useRef(null);
  const socket = useContext(SocketContext);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

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
    if (isPageVisible) {
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

  const handleContextMenu = (message, event) => {
    event.preventDefault();
    setSelectedMessage(message);
    setPopupPosition({ top: event.clientY, left: event.clientX });
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
    // Function to handle message editing
  };

  const handleDeleteMessage = () => {
    // Function to handle message deletion
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
        className="bg-zinc-900 p-2 rounded-lg cursor-pointer max-w-[300px] w-full mr-8"
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

  const renderMessage = (message, index, isSameDayAsNext) => {
    const hasLongWord = message?.message
      .split(/\s+/)
      .some((word) => word.length > 20);

    return (
      <div
        className="relative z-10"
        key={message?._id + index}
        id={`message-${message?._id}`}
        onContextMenu={(e) => handleContextMenu(message, e)}
        onTouchStart={() => handleTouchStart(message)}
        onTouchEnd={handleTouchEnd}
      >
        {!isSameDayAsNext && (
          <div className=" flex w-full justify-center">
            <div className=" flex max-w-fit text-center font-normal text-[14px] my-2 dark:text-white px-2 py-1 bg-slate-800 bg-opacity-70 rounded-lg">
              {format(parseISO(message?.createdAt), "PPP")}
            </div>
          </div>
        )}
        <div
          className={`flex relative z-10 ${
            message?.writerId?._id !== sessionUserId
              ? "justify-start"
              : "justify-end"
          }`}
        >
          <div
            className={`flex items-end gap-2 relative z-10 ${
              message?.writerId._id !== sessionUserId
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
                className="rounded-full object-fill h-[30px] w-[30px] z-10"
              />
            )}
            <div
              className={`flex flex-col relative px-1 py-2 gap-1 rounded-lg w-11/12 z-10 ${
                message?.writerId._id !== sessionUserId
                  ? " bg-secondary-700 text-gray-200 rounded-bl-none"
                  : " bg-secondary-800 text-gray-200  rounded-br-none"
              }`}
            >
              {message?.replyTo && renderReplyPreview(message)}

              {message?.media && <MediaGrid media={message?.media} />}

              <div className="flex flex-col w-full">
                <p
                  className={`${
                    !message?.message && "hidden"
                  } w-full min-w-[70px] max-w-[700px] px-2 pb-2 break-normal font-inter font-extralight text-3xs ${
                    hasLongWord ? "break-all" : ""
                  } flex-grow`}
                >
                  {renderMessageWithLinks(message?.message)}
                </p>
                <div
                  className={twMerge(
                    `flex w-full justify-end items-end -mb-2 -mr-1`
                  )}
                >
                  <span
                    className={`flex font-normal text-[10px] h-4 text-gray-100 min-w-[28px]`}
                  >
                    {format(parseISO(message?.createdAt), "HH:mm")}
                  </span>
                  <p className="flex items-center justify-center text-[14px] h-4">
                    {renderMessageStatus(message)}
                  </p>
                </div>
              </div>
              {selectedMessage && selectedMessage._id === message?._id && (
                <div
                className="flex flex-col gap-3 items-start fixed z-3000 rounded-md bg-zinc-900 p-2"
                style={{ touchAction: "none", userSelect: "none", top: popupPosition.top, left: popupPosition.left }}
              >
                <button
                  style={{ touchAction: "none", userSelect: "none" }}
                  onClick={handleReply}
                  className="flex items-center justify-between gap-3"
                >
                  <GoReply className="w-5 h-5 text-white" />
                  <p className="flex items-center justify-center text-[14px]">
                    Reply
                  </p>
                </button>
                <button
                  style={{ touchAction: "none", userSelect: "none" }}
                  onClick={handleCopyText}
                  className="flex items-center justify-between gap-3"
                >
                  <IoMdCopy className="w-5 h-5 text-white" />
                  <p className="flex items-center justify-center text-[14px]">
                    Copy text
                  </p>
                </button>
                {/* <button
                disabled
                  style={{ touchAction: "none", userSelect: "none" }}
                  onClick={handleEditMessage}
                  className="flex items-center justify-between gap-3"
                >
                  <IoPencilOutline className="w-5 h-5 text-white" />
                  <p className="flex items-center justify-center text-[14px]">
                    Edit
                  </p>
                </button>
                <button
                disabled
                  style={{ touchAction: "none", userSelect: "none" }}
                  onClick={handleDeleteMessage}
                  className="flex items-center justify-between gap-3"
                >
                  <IoTrashOutline className="w-5 h-5 text-white" />
                  <p className="flex items-center justify-center text-[14px]">
                    Delete
                  </p>
                </button>
                <button
                disabled
                  style={{ touchAction: "none", userSelect: "none" }}
                  onClick={handlePinMessage}
                  className="flex items-center justify-between gap-3"
                >
                  <IoPinOutline className="w-5 h-5 text-white" />
                  <p className="flex items-center justify-center text-[14px]">
                    Pin
                  </p>
                </button> */}
              </div>
                
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-full">
      <div className="scrollableDiv relative z-10 h-full overflow-y-auto w-full">
        {messagesList.length !== 0 && sessionUserId ? (
          <div className={`message-list pb-2`}>
            {messagesList.map((message, index) => {
              const isSameDayAsNext =
                index < messagesList.length - 1 &&
                isSameDay(
                  parseISO(message?.createdAt),
                  parseISO(messagesList[index + 1].createdAt)
                );
              return renderMessage(message, index, isSameDayAsNext);
            })}
          </div>
        ) : (
          <div className="message-list">
            Start chatting or wait for messages to load
          </div>
        )}
      </div>
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessageList;
