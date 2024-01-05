'use client';

import VideoCallPlayer from '~/components/videoCallComponents/VideoCallPlayer';
import SidebarVideo from '~/components/videoCallComponents/SidebarVideo';
import Notifications from '~/components/videoCallComponents/Notifications';

const VideoCall = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <VideoCallPlayer />
      <SidebarVideo>
        <Notifications />
      </SidebarVideo>
    </div>
  );
};

export default VideoCall;

