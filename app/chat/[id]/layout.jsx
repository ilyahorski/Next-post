'use client';

import { SessionProvider } from 'next-auth/react';

const ChatLayout = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>
};

export default ChatLayout;