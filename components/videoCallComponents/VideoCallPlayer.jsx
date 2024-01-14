'use client';

import React, { useContext, useState } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 're-resizable';
import VideoApp from '~/components/videoCallComponents/VideoApp';
import { VideoSocketContext } from '~/utils/context/VideoContext';

const VideoCallPlayer = () => {
  
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const {width, height, setWidth, setHeight} = useContext(VideoSocketContext);

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
          <VideoApp />
        </Resizable>
      </div>
    </Draggable>
  );
};

export default VideoCallPlayer;