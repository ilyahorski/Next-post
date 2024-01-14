'use client';

import { SessionProvider } from 'next-auth/react';
import Provider from "~/app/provider";

const ChatLayout = ({ children }) => {
  return <Provider>{children}</Provider>
};

export default ChatLayout;