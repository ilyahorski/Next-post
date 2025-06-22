import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

export const useMessages = (chatId, sessionUserId, socket) => {
    const [newMessageGet, setNewMessageGet] = useState(false);
    const [newMessages, setNewMessages] = useState([]);
    const queryClient = useQueryClient();

    const fetchMessages = async ({ pageParam = 1 }) => {
        const response = await fetch(`/api/message?page=${pageParam}&limit=50`, {
            headers: { chatId },
        });
        const data = await response.json();
        return data;
    };

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: ["messages", chatId],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.usersMessages.length < 50) {
                return undefined;
            }
            return pages.length + 1;
        },
        enabled: !!chatId,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        staleTime: 30000, // 30 seconds
        gcTime: 5 * 60 * 1000, // 5 minutes
    });

    const messagesList = data ? data.pages.flatMap((page) => page.usersMessages) : [];

    const updateMessages = useCallback(
        (newMessage) => {
            setNewMessageGet(true);
            queryClient.setQueryData(["messages", chatId], (oldData) => {
                if (!oldData) {
                    return { pages: [{ usersMessages: [newMessage] }], pageParams: [1] };
                }

                const messageExists = oldData.pages.some((page) => page.usersMessages.some((msg) => msg._id === newMessage._id));

                if (messageExists) {
                    return oldData;
                }

                return {
                    ...oldData,
                    pages: [{ usersMessages: [newMessage, ...oldData.pages[0].usersMessages] }, ...oldData.pages.slice(1)],
                };
            });
        },
        [queryClient, chatId]
    );

    // Socket event handlers
    useEffect(() => {
        if (!socket || !chatId || !sessionUserId) {
            return;
        }

        socket.emit("getMessages", { chatId });
        socket.emit("markMessagesAsDelivered", { chatId, userId: sessionUserId });

        const handleNewMessage = (message) => {
            if (message.chatId === chatId) {
                setNewMessages((prev) => [...prev, message]);
                updateMessages(message);
                socket.emit("markMessageAsDelivered", {
                    messageId: message._id,
                    chatId,
                });
                setNewMessageGet(false);
            }
        };

        const handleMessageStatusUpdated = (updatedMessage) => {
            queryClient.setQueryData(["messages", chatId], (oldData) => {
                if (!oldData) {
                    return oldData;
                }

                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        usersMessages: page.usersMessages.map((msg) => (msg._id === updatedMessage._id ? { ...msg, messageStatus: updatedMessage.messageStatus } : msg)),
                    })),
                };
            });
        };

        const handleMessageUpdated = (updatedMessage) => {
            if (updatedMessage && updatedMessage._id) {
                queryClient.setQueryData(["messages", chatId], (oldData) => {
                    if (!oldData) {
                        return oldData;
                    }

                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) => ({
                            ...page,
                            usersMessages: page.usersMessages.map((msg) => (msg._id === updatedMessage._id ? { ...msg, message: updatedMessage.message } : msg)),
                        })),
                    };
                });
            } else {
                console.error("Received invalid updated message:", updatedMessage);
            }
        };

        const handleMessageDeleted = ({ messageId }) => {
            queryClient.setQueryData(["messages", chatId], (oldData) => {
                if (!oldData) {
                    return oldData;
                }
                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        usersMessages: page.usersMessages.filter((msg) => msg._id !== messageId),
                    })),
                };
            });
        };

        // Register socket listeners
        socket.on("newMessage", handleNewMessage);
        socket.on("messageStatusUpdated", handleMessageStatusUpdated);
        socket.on("messageUpdated", handleMessageUpdated);
        socket.on("messageDeleted", handleMessageDeleted);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("messageStatusUpdated", handleMessageStatusUpdated);
            socket.off("messageUpdated", handleMessageUpdated);
            socket.off("messageDeleted", handleMessageDeleted);
        };
    }, [socket, chatId, sessionUserId, queryClient, updateMessages]);

    // Clear new messages after a short delay
    useEffect(() => {
        if (newMessages.length > 0) {
            const timer = setTimeout(() => {
                setNewMessages([]);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [newMessages]);

    return {
        messagesList,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        newMessageGet,
        setNewMessageGet,
        newMessages,
        isLoading: status === "loading",
        isError: status === "error",
    };
};
