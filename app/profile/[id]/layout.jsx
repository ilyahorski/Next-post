'use client';

import {SessionProvider} from "next-auth/react";

const ProfileLayout = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default ProfileLayout;