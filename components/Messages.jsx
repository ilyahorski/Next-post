"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

import { Loader } from "~/components/Loading";
import MessageForm from "~/components/MessageForm";
import MessageList from "~/components/MessageList";
import SettingsPopover from "~/components/SettingsPopover";
import { SocketContext } from "~/utils/context/SocketContext";
import { VideoSocketContext } from "~/utils/context/VideoContext";
import { useMessages } from "~/utils/hooks/useMessages";
import { useMessageScroll } from "~/utils/hooks/useMessageScroll";
import { useMobileCheck } from "~/utils/hooks/useMobileCheck";
import { useUserStatus } from "~/utils/hooks/useUserStatus";

import { ChatHeader } from "./chat";

const Messages = ({ sessionUserId }) => {
    const [isSettingOpen, setIsSettingOpen] = useState(false);
    const [background, setBackground] = useState("/assets/bg/1.jpg");
    const [replyTo, setReplyTo] = useState(null);

    const formEndRef = useRef(null);
    const messageEndRef = useRef(null);
    const popoverRef = useRef(null);

    const isMobile = useMobileCheck();
    const { id: chatId } = useParams();

    const socket = useContext(SocketContext);
    const { isVideoChatVisible, setIsVideoChatVisible } = useContext(VideoSocketContext);

    // Custom hooks
    const userStatuses = useUserStatus(socket, sessionUserId);

    const { messagesList, fetchNextPage, hasNextPage, isFetchingNextPage, newMessageGet, isLoading: messagesLoading, isError: messagesError } = useMessages(chatId, sessionUserId, socket);

    useMessageScroll(newMessageGet, messageEndRef, formEndRef);

    // Fetch chat data
    const fetchChat = async (chatId) => {
        const response = await fetch(`/api/chats/${chatId}`);

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        return response.json();
    };

    const {
        data: chat,
        error: chatError,
        isLoading: chatLoading,
    } = useQuery({
        queryKey: ["chat", chatId],
        queryFn: () => fetchChat(chatId),
        enabled: !!chatId,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Handle video chat visibility from URL params
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const openedFromPush = urlParams.get("source") === "push";
        const actionType = urlParams.get("type") === "reject";

        if (openedFromPush && !actionType) {
            setIsVideoChatVisible(!isVideoChatVisible);
        }
    }, [isVideoChatVisible, setIsVideoChatVisible]);

    // Handle background storage
    useEffect(() => {
        const storageKey = `chat-background-${chatId}`;
        const storedBackground = localStorage.getItem(storageKey);

        if (storedBackground) {
            setBackground(storedBackground);
        }
    }, [chatId]);

    // Event handlers
    const handleToggleVideoChat = () => {
        setIsVideoChatVisible(!isVideoChatVisible);
    };

    const handleOpenSettings = (event) => {
        event.stopPropagation();
        setIsSettingOpen(true);
    };

    const handleReply = (message) => {
        setReplyTo(message);
    };

    // Loading and error states
    if (messagesLoading) {
        return <Loader />;
    }

    if (chatError) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-red-500">Error: {chatError.message}</div>
            </div>
        );
    }

    if (messagesError) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-red-500">Error loading messages please try again.</div>
            </div>
        );
    }

    return (
        <div className="scrollableBg flex flex-col custom-height flex-grow w-full" style={{ "--scrollableDiv-background": `url(${background})` }}>
            <ChatHeader
                chat={chat}
                sessionUserId={sessionUserId}
                userStatuses={userStatuses}
                isVideoChatVisible={isVideoChatVisible}
                onToggleVideoChat={handleToggleVideoChat}
                onOpenSettings={handleOpenSettings}
                popoverRef={popoverRef}
            />

            <section className="scrollableDiv flex flex-col-reverse overflow-y-auto h-full w-full max-w-full min-w-0 flex-grow" id="scrollableDiv">
                <div className="flex-grow overflow-hidden">
                    <MessageList
                        messagesList={messagesList}
                        isMobile={isMobile}
                        sessionUserId={sessionUserId}
                        onReply={handleReply}
                        messageEndRef={messageEndRef}
                        fetchNextPage={fetchNextPage}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                </div>
            </section>

            <div className="flex items-center w-full gap-2 mt-auto bg-black rounded-b-md">
                <MessageForm id={chatId} chat={chat} sessionUserId={sessionUserId} formEndRef={formEndRef} replyTo={replyTo} setReplyTo={setReplyTo} messageEndRef={messageEndRef} />
            </div>

            {isSettingOpen && (
                <div className="absolute inset-0 top-0 flex items-start justify-end z-[1000]">
                    <SettingsPopover
                        popoverRef={popoverRef}
                        chat={chat}
                        setIsSettingOpen={setIsSettingOpen}
                        onClose={() => setIsSettingOpen(false)}
                        background={background}
                        setBackground={setBackground}
                    />
                </div>
            )}
        </div>
    );
};

export default Messages;
