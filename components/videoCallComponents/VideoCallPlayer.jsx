'use client';

import React, { useContext, useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import VideoApp from '~/components/videoCallComponents/VideoApp';
import { VideoSocketContext } from '~/utils/context/VideoContext';
import { useParams } from "next/navigation";

const VideoCallPlayer = () => {
  const [chat, setChat] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const {width, height, setWidth, setHeight} = useContext(VideoSocketContext);
  const { id: chatId } = useParams();

  const onResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
  };
  
  const onResizeEnd = (e, direction, ref, d) => {
    e.stopPropagation();
    setIsResizing(false);
    setWidth(width + d.width);
    setHeight(height + d.height);
  };
  
  const onDrag = (e, data) => {
    if (!isResizing) {
      setPosition({ x: data.x, y: data.y });
    }
  };

  useEffect(() => {
    if (!chatId) return;
    const getChat = async () => {
      const response = await fetch(`/api/chats/${chatId}`);
      const data = await response.json();

      setChat(data.membersList);
    };

    if (chatId) {
      getChat();
    }
  }, [chatId]);

  if (!chat || !chatId) {
    return null;
  }

  return (
    <Draggable disabled={isResizing} position={position} onDrag={onDrag} cancel="#noDrag, #noMainDrag, #userDrag, #noExpandDrag">
      <div className="fixed resize z-[100] rounded-lg" style={{ top: position.y, left: position.x }}>
        <Resizable
          defaultSize={{
            width: 350,
            height: 500,
          }}
          size={{
            width: width,
            height: height,
          }}
          minHeight={200}
          minWidth={175}
          onResizeStart={onResizeStart}
          onResizeStop={onResizeEnd}
          className="rounded-lg "
        >
          <VideoApp chatMembers={chat}/>
        </Resizable>
      </div>
    </Draggable>
  );
};

export default VideoCallPlayer;