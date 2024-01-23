'use client'

import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';

export const SocketContext = createContext();
export const SessionContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [sessionUserId, setSessionUserId] = useState(null);
  const { data: session, status, update } = useSession();

  const LOCAL = 'http://localhost:4000';
  const HEROKU = 'https://next-post-bc80bba88d82.herokuapp.com';

  useEffect(() => {
    if (!session?.user?.id) {
      update()
    }
    if (session?.user?.id) {
      setSessionUserId(session.user.id);
      const newSocket = io(`${HEROKU}`, {
        query: {
          userId: session?.user?.id
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [session?.user?.id]);

  return (
    <SessionContext.Provider value={sessionUserId}>
      <SocketContext.Provider value={socket}>
        {children}
      </SocketContext.Provider>
    </SessionContext.Provider>
  );
};

export default SocketProvider;
