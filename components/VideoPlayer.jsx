import React, {useState} from 'react';
import ReactPlayer from 'react-player';
import {FaPlay, FaPause} from 'react-icons/fa';
import {CgToolbarBottom} from "react-icons/cg";
import {LiaFileVideo} from "react-icons/lia";
import {useRouter} from "next/navigation";

const VideoPlayer = ({full, post, preview}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const router = useRouter();

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

  const handlePostOpen = (post) => {
    router.push(`/post/${post.creator.username}?id=${post._id}`);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-90%"
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
          className={controlsVisible ? "hidden" : "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"}
        >
          {isPlaying
            ?
            <FaPause
              title='Click to pause video'
              className='w-8 h-8 text-gray-300 dark:text-white'
            />
            :
            <FaPlay
              title='Click to play video'
              className='w-8 h-8 text-gray-300 dark:text-white'
            />
          }
        </div>
      )}
      <div
        title='Click to display a player controls'
        onClick={handleControlsVisibility}
        className={preview || post.image ? "absolute top-0 right-0 m-2 cursor-pointer" : "hidden"}
      >
        <CgToolbarBottom className='w-6 h-6 text-gray-300 dark:text-white'/>
      </div>
      {!full &&
        <div
          title='Click to open a post page'
          onClick={() => handlePostOpen(post)}
          className={preview || post.image ? "absolute top-0 left-0 m-2 cursor-pointer" : "hidden"}
        >
          <LiaFileVideo className='w-6 h-6 text-gray-300 dark:text-white'/>
        </div>
      }
    </div>
  );
};

export default VideoPlayer;
