'use client'

import Sidebar from "~/components/Sidebar";
import Messages from "~/components/Messages";
import SplitPane, { SplitPaneLeft, SplitPaneRight, Divider } from '~/components/Splitter';
import {useContext, useEffect, useState} from "react";
import {useMobileCheck} from "~/utils/hooks/useMobileCheck";
import { VideoSocketContext } from '~/utils/context/VideoContext';
import {useSession} from "next-auth/react";
import VideoCallPlayer from "~/components/videoCallComponents/VideoCallPlayer";

const MessageMain = () => {
  const [showCreateChatForm, setShowCreateChatForm] = useState(true);
  const {data: session, status, update} = useSession();
  const isMobile = useMobileCheck();

  const {isVideoChatVisible} = useContext(VideoSocketContext);

  useEffect(() => {
    if (!session?.user?.id) {
      update()
    }
    return () => false;
  }, [session?.user?.id])

  useEffect(() => {
    if (isMobile) {
      setShowCreateChatForm(true)
    }
    return () => false;
  }, [isMobile]);

  return (
    <>
      {session?.user?.id ? (
        <SplitPane className='w-[100dvw] flex -mt-[40px]' >
          <SplitPaneLeft>
            {showCreateChatForm && isMobile ? (
              <Messages
                sessionUserId={session?.user?.id}
                closeForm={() => setShowCreateChatForm(false)}
              />
            ) : (!showCreateChatForm || !isMobile) && (
              <Sidebar
                sessionUserId={session?.user?.id}
                openForm={() => setShowCreateChatForm(true)}
              />
            )}
          </SplitPaneLeft>
          <Divider className="hidden mob:flex border border-gray-400 rounded-md mx-1 hover:cursor-col-resize" />
          {(!isMobile || !showCreateChatForm) && status === 'authenticated' && (
            <SplitPaneRight>
              <Messages
                sessionUserId={session?.user?.id}
              />
            </SplitPaneRight>
          )}
          {isVideoChatVisible && <VideoCallPlayer/>}
        </SplitPane>
      ) : (
        <div>
          Loading ...
        </div>
      )}
    </>
  );
};

export default MessageMain;



