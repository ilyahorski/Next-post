import Image from "next/image";
import { useEffect, useRef } from "react";
import { format, isSameDay, parseISO } from "date-fns";

const MessageList = ({ messagesList, isMobile, sessionUserId }) => {
  const endOfMessages = useRef(null);

  useEffect(() => {
    if (endOfMessages.current) {
      const scrollContainer = endOfMessages.current.parentElement;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messagesList]);

  const renderMessage = (message, index, isSameDayAsNext) => {
    return (
      <div
        key={message._id + index}
        ref={index === messagesList.length - 1 ? endOfMessages : null}
      >
        {!isSameDayAsNext && (
          <div className="text-center font-normal text-[14px] my-1 text-black dark:text-zinc-100">
            {format(parseISO(message.createdAt), "PPP")}
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
            <div className="relative max-w-[350px]">
              <p
                className={`flex flex-col font-inter font-extralight text-3xs px-2 py-1 rounded-lg break-words ${
                  message.writerId._id !== sessionUserId
                    ? "bg-primary-600 dark:bg-primary-800 text-black dark:text-gray-200 rounded-bl-none"
                    : "bg-primary-700 dark:bg-primary-900 dark:text-gray-200 text-gray-200 rounded-br-none"
                }`}
              >
                {message.message}
                <span className="block text-right font-normal text-[10px] mt-1 text-black">
                  {format(parseISO(message.createdAt), "HH:mm")}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {messagesList.length !== 0 && sessionUserId ? (
        <div className="message-list">
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
    </>
  );
};

export default MessageList;
