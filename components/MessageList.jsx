import { isSameDay, parseISO } from "date-fns";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

import { useMessageLogic } from "~/utils/hooks/useMessageLogic";

import DateSeparator from "./message/DateSeparator";
import MessageItem from "./message/MessageItem";

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
    const messageListRef = useRef(null);
    const { ref, inView } = useInView({ threshold: 0 });

    const {
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
    } = useMessageLogic({ messagesList, sessionUserId });

    // Handle infinite scroll
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const renderMessage = (message, index) => {
        const isSameDayAsNext =
            index < messagesList.length - 1 &&
            isSameDay(
                parseISO(message?.createdAt),
                parseISO(messagesList[index + 1].createdAt)
            );

        return (
            <div
                className="relative"
                key={message?._id + index}
                id={`message-${message?._id}`}
            >
                {!isSameDayAsNext && <DateSeparator date={message?.createdAt} />}
        
                {message?.writerId?._id && (
                    <MessageItem
                        message={message}
                        sessionUserId={sessionUserId}
                        isMobile={isMobile}
                        selectedMessage={selectedMessage}
                        chatId={chatId}
                        onContextMenu={handleContextMenu}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onReactionClick={handleReactionClick}
                        onReply={() => handleReply(onReply)}
                        onCopyText={handleCopyText}
                        onEditMessage={handleEditMessage}
                        onDeleteMessage={handleDeleteMessage}
                        onScrollToMessage={scrollToMessage}
                        setSelectedMessage={setSelectedMessage}
                    />
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
                    <div className="message-list pb-2">
                        {messagesList.map((message, index) => renderMessage(message, index))}
                        {isFetchingNextPage && (
                            <div className="flex justify-center py-4">
                                <div className="text-gray-400">Loading more...</div>
                            </div>
                        )}
                        <div ref={ref} className="h-0.5 border-2 border-transparent" />
                    </div>
                ) : (
                    <div className="message-list flex items-center justify-center h-full">
                        <div className="text-gray-400 text-center">
                            Start chatting or wait for messages to load
                        </div>
                    </div>
                )}
            </div>
            <div className="h-1" />
            <div ref={messageEndRef} className="h-0.5" />
        </div>
    );
};

export default MessageList;
