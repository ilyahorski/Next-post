'use client'

import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';

export const SocketContext = createContext();
export const SessionContext = createContext();

const SocketProvider = ({ children, serverSession }) => {
  const [socket, setSocket] = useState(null);
  const [sessionUserId, setSessionUserId] = useState(serverSession?.user?.id || null);
  const { data: session, status, update } = useSession();

  useEffect(() => {
    if (!session && !serverSession) {
      update()
    }
    const currentSession = session || serverSession;
    if (currentSession?.user?.id) {
      setSessionUserId(currentSession.user.id);
      const newSocket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}`, {
        query: {
          userId: currentSession.user.id
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [session, serverSession]);

  return (
    <SessionContext.Provider value={sessionUserId}>
      <SocketContext.Provider value={socket}>
        {children}
      </SocketContext.Provider>
    </SessionContext.Provider>
  );
};

export default SocketProvider;