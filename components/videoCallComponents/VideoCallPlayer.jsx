import React, { useContext } from 'react';
import { VideoSocketContext } from '~/utils/context/VideoContext';

const VideoCallPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(VideoSocketContext);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 justify-center md:flex md:flex-col">
      {stream && (
        <div className="p-2 m-2">
          <div className="mb-2 text-lg">{name || 'Name'}</div>
          <video playsInline muted ref={myVideo} autoPlay className="w-550 md:w-300 rounded-md" />
        </div>
      )}
      {callAccepted && !callEnded && (
        <div className="p-2 m-2">
          <div className="mb-2 text-lg">{call.name || 'Name'}</div>
          <video playsInline ref={userVideo} autoPlay className="w-550 md:w-300" />
        </div>
      )}
    </div>
  );
};

export default VideoCallPlayer;
