'use client';

import React, { createContext, useState } from 'react';

export const VideoSocketContext = createContext();

const VideoContextProvider = ({ children }) => {
  const [isVideoChatVisible, setIsVideoChatVisible] = useState(false);
  const [width, setWidth] = useState(320);
  const [height, setHeight] = useState(500);

  return (
    <VideoSocketContext.Provider value={{
      isVideoChatVisible,
      setIsVideoChatVisible,
      width,
      setWidth,
      height,
      setHeight
    }}>
      {children}
    </VideoSocketContext.Provider>
  );
};

export default VideoContextProvider;

