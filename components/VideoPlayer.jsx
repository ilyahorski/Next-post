import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { FaPlay, FaPause } from 'react-icons/fa';
import {CgToolbarBottom} from "react-icons/cg";
import {LiaFileVideo} from "react-icons/lia";

const VideoPlayer = ({ post, preview }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleControlsVisibility = () => {
    setControlsVisible(!controlsVisible);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-90% cursor-pointer"
    >
      <ReactPlayer
        width="100%"
        height="100%"
        playing={isPlaying}
        controls={controlsVisible}
        url={preview ? preview : (post.image ? post.image : post.userImage)}
      />
      {isHovered && (
        <div
          onClick={handlePlayPause}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          {isPlaying ? <FaPause className='w-8 h-8 text-gray-300 dark:text-white' /> : <FaPlay className='w-8 h-8 text-gray-300 dark:text-white' />}
        </div>
      )}
      <div
        onClick={handleControlsVisibility}
        className={preview || post.image ? "absolute top-0 right-0 m-2" : "hidden"}
      >
        <CgToolbarBottom className='w-6 h-6 text-gray-300 dark:text-white' />
      </div>
      <div
        className={preview || post.image ? "absolute top-0 left-0 m-2" : "hidden"}
      >
        <LiaFileVideo className='w-6 h-6 text-gray-300 dark:text-white' />
      </div>
    </div>
  );
};

export default VideoPlayer;
