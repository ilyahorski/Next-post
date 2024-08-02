import Image from "next/image";
import { useEffect, useRef } from "react";
import { format, isSameDay, parseISO } from "date-fns";
import MediaGrid from "./MediaGrid";

const MessageList = ({
  messagesList,
  isMobile,
  sessionUserId,
  scrollToBottom,
}) => {
  const endOfMessages = useRef(null);

  useEffect(() => {
    if (endOfMessages.current) {
      scrollToBottom();
    }
  }, [messagesList, scrollToBottom]);

  const renderMessage = (message, index, isSameDayAsNext) => {
    const hasLongWord = message.message
      .split(/\s+/)
      .some((word) => word.length > 20);

    return (
      <div
        className="z-50"
        key={message._id + index}
        ref={index === messagesList.length - 1 ? endOfMessages : null}
      >
        {!isSameDayAsNext && (
          <div className=" flex w-full justify-center">
            <div className=" flex max-w-fit text-center font-normal text-[14px] my-2 dark:text-white px-2 py-1 bg-slate-800 bg-opacity-70 rounded-lg">
              {format(parseISO(message.createdAt), "PPP")}
            </div>
          </div>
        )}
        <div
          className={`flex ${
            message?.writerId?._id !== sessionUserId
              ? "justify-start"
              : "justify-end"
          }`}
        >
          <div
            className={`flex items-end gap-2 ${
              message.writerId._id !== sessionUserId
                ? "flex-row"
                : "flex-row-reverse"
            }`}
          >
            {!isMobile && (
              <Image
                src={message.writerId.userImage || message.writerId.image}
                alt="user_image"
                width={30}
                height={30}
                className="rounded-full object-fill h-[30px] w-[30px]"
              />
            )}
            <div
              className={`flex flex-col relative pl-1 py-2 gap-3 rounded-lg w-11/12 ${
                message.writerId._id !== sessionUserId
                  ? "bg-primary-600 dark:bg-primary-700 text-black dark:text-gray-200 rounded-bl-none"
                  : "bg-primary-700 dark:bg-primary-900 dark:text-gray-200 text-gray-200 rounded-br-none"
              }`}
            >
              <MediaGrid media={message.media} />
              <div className="flex items-end">
              <p
                className={`w-full pr-12 pl-2 break-normal font-inter font-extralight text-3xs ${
                  hasLongWord ? "break-all" : ""
                } flex-grow`}
              >
                {message.message}
              </p>
              
              <span
                className={`absolute bottom-1 right-0 font-normal text-[10px] mt-1 text-black min-w-[30px]`}
              >
                {format(parseISO(message.createdAt), "HH:mm")}
              </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-full">
      <div className="relative z-10 h-full overflow-y-auto">
        {messagesList.length !== 0 && sessionUserId ? (
          <div className={`message-list pb-2`}>
            {messagesList.map((message, index) => {
              const isSameDayAsNext =
                index < messagesList.length - 1 &&
                isSameDay(
                  parseISO(message.createdAt),
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
    </div>
  );
};

export default MessageList;
