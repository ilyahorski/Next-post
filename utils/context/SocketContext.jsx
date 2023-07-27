import { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { data: session } = useSession();

  const LOCAL = 'http://localhost:4000';
  const HEROKU = 'https://next-post-bc80bba88d82.herokuapp.com';

  useEffect(() => {
    if (session?.user) {
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
  }, [session]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
