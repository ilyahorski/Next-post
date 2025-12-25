"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { createContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();
export const SessionContext = createContext();
export const MessageContext = createContext();

const SocketProvider = ({ children, serverSession }) => {
    const [socket, setSocket] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);
    const [sessionUserId, setSessionUserId] = useState(serverSession?.user?.id || null);
    const [chatId, setChatId] = useState(null);
    const { data: session, update } = useSession();
    const pathname = usePathname();
    const isChatRoute = useMemo(() => pathname?.startsWith("/chat/"), [pathname]);

    useEffect(() => {
        if (sessionUserId) {
            return;
        }

        const currentSession = serverSession || session;
        if (currentSession?.user?.id) {
            setSessionUserId(currentSession.user.id);
        }
    }, [serverSession, session, sessionUserId]);

    useEffect(() => {
        if (!sessionUserId) {
            update();
            return;
        }

        if (isChatRoute && !chatId) {
            return;
        }

        const query = { userId: sessionUserId };

        if (chatId) {
            query.chatId = chatId;
        }

        const newSocket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`, {
            query,
            transports: ["websocket"],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [sessionUserId, chatId, isChatRoute, update]);

    const socketContextValue = useMemo(
        () => ({
            socket,
            chatId,
            setChatId,
        }),
        [socket, chatId]
    );

    const messageContextValue = useMemo(() => ({
        selectedMessage,
        setSelectedMessage,
        editingMessage,
        setEditingMessage,
    }), [selectedMessage, editingMessage]);

    return (
        <SessionContext.Provider value={sessionUserId}>
            <SocketContext.Provider value={socketContextValue}>
                <MessageContext.Provider value={messageContextValue}>{children}</MessageContext.Provider>
            </SocketContext.Provider>
        </SessionContext.Provider>
    );
};

export default SocketProvider;
