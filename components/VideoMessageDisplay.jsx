"use client";

import { useState } from "react";
import ReactPlayer from "react-player";
import { CiPlay1 } from "react-icons/ci";
import { CiPause1 } from "react-icons/ci";
import { useMobileCheck } from "~/utils/hooks/useMobileCheck";

const VideoMessageDisplay = ({ videoUrl }) => {
  const [playing, setPlaying] = useState(false);
  const isMobile = useMobileCheck();

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  return (
    <div className={`${isMobile ? "mr-5": "mr-0"} relative w-52 h-52 rounded-full overflow-hidden flex justify-center items-center bg-black`}>
      <button
        onClick={handlePlayPause}
        className="absolute z-10 w-12 h-12 bg-black bg-opacity-50 text-white text-2xl rounded-full flex justify-center items-center"
      >
        {playing ? <CiPause1 /> : <CiPlay1 />}
      </button>

      <ReactPlayer
        width="200px"
        height="200px"
        loop={true}
        className="flex items-center justify-center rounded-full"
        controls={false}
        playing={playing}
        url={videoUrl}
      />
    </div>
  );
};

export default VideoMessageDisplay;
