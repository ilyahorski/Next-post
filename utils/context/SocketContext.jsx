'use client'

import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';

export const SocketContext = createContext();
export const SessionContext = createContext();
export const MessageContext = createContext();

const SocketProvider = ({ children, serverSession }) => {
  const [socket, setSocket] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [sessionUserId, setSessionUserId] = useState(serverSession?.user?.id || null);
  const { data: session, status, update } = useSession();

  useEffect(() => {
    if (sessionUserId) {
      return;
    }
    const currentSession = serverSession || session;
    if (currentSession?.user?.id) {
      setSessionUserId(currentSession.user.id);
    }
  }, [serverSession, session]);

  useEffect(() => {
    if (!sessionUserId) {
      update();
    }

    const newSocket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`, {
      query: {
        userId: sessionUserId
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [sessionUserId]);

  return (
    <SessionContext.Provider value={sessionUserId}>
      <SocketContext.Provider value={socket}>
        <MessageContext.Provider value={{ selectedMessage, setSelectedMessage, editingMessage, setEditingMessage }}>
          {children}
        </MessageContext.Provider>
      </SocketContext.Provider>
    </SessionContext.Provider>
  );
};

export default SocketProvider;