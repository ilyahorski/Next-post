import { format, parseISO } from "date-fns";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

import MediaGrid from "../MediaGrid";
import MessageMenu from "./MessageMenu";
import MessageReactions from "./MessageReactions";
import MessageStatus from "./MessageStatus";
import MessageWithLinks from "./MessageWithLinks";
import ReplyPreview from "./ReplyPreview";

const MessageItem = ({
    message,
    sessionUserId,
    isMobile,
    selectedMessage,
    chatId,
    onContextMenu,
    onTouchStart,
    onTouchEnd,
    onReactionClick,
    onReply,
    onCopyText,
    onEditMessage,
    onDeleteMessage,
    onScrollToMessage,
    setSelectedMessage,
}) => {
    const hasLongWord = message?.message?.split(/\s+/).some((word) => word.length > 16);

    return (
        <div className={`flex relative ${message?.writerId?._id !== sessionUserId ? "justify-start" : "justify-end"}`}>
            <div className={`flex items-end gap-2 relative ${message?.writerId?._id !== sessionUserId ? "flex-row" : "flex-row-reverse"}`}>
                {!isMobile && <Image src={message?.writerId.userImage || message?.writerId.image} alt="user_image" width={30} height={30} className="rounded-full object-fill h-[30px] w-[30px]" />}
                <div
                    className={twMerge(`no-select flex flex-col relative gap-1 rounded-lg w-11/12
                        ${message?.media ? "p-2" : "px-1 py-2"} 
                        ${message?.writerId._id !== sessionUserId ? " bg-gray-900 text-gray-200 rounded-bl-none" : " bg-secondary-900 text-gray-200  rounded-br-none"}`)}
                    onContextMenu={(e) => onContextMenu(message, e)}
                    onTouchStart={() => onTouchStart(message)}
                    onTouchEnd={onTouchEnd}
                >
                    {message?.replyTo && <ReplyPreview replyToMessage={message} onScrollToMessage={onScrollToMessage} />}

                    {message?.media && <MediaGrid media={message?.media} />}

                    <div className="flex flex-col w-full no-select">
                        <div
                            className={`${!message?.message && "hidden"} w-full min-w-[70px] max-w-[700px] px-2 pb-2 whitespace-pre-wrap font-inter font-extralight text-3xs ${
                                hasLongWord ? "break-all" : "break-normal"
                            } flex-grow`}
                        >
                            <MessageWithLinks message={message?.message} />
                        </div>
                        <div className="flex justify-end">
                            <MessageReactions message={message} sessionUserId={sessionUserId} onReactionClick={onReactionClick} />
                            <div className={twMerge("flex w-[50px] justify-end items-end -mb-2 -mr-1")}>
                                <span className={"flex font-normal text-[10px] h-4 text-gray-100 min-w-[28px]"}>{format(parseISO(message?.createdAt), "HH:mm")}</span>
                                <div className="flex items-center justify-center text-[14px] h-4">
                                    <MessageStatus message={message} sessionUserId={sessionUserId} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <MessageMenu
                        message={message}
                        selectedMessage={selectedMessage}
                        sessionUserId={sessionUserId}
                        chatId={chatId}
                        onReply={onReply}
                        onCopyText={onCopyText}
                        onEditMessage={onEditMessage}
                        onDeleteMessage={onDeleteMessage}
                        setSelectedMessage={setSelectedMessage}
                    />
                </div>
            </div>
        </div>
    );
};

export default MessageItem;
