'use client';

import Provider from '@/app/provider';

const ProfileLayout = ({ children }) => {
  return (
    <Provider>
      {children}
    </Provider>
  );
};

export default ProfileLayout;