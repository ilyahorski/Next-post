'use client'

import Sidebar from "~/components/Sidebar";
import Messages from "~/components/Messages";
import SplitPane, { SplitPaneLeft, SplitPaneRight, Divider } from '~/components/Splitter';
import {useContext, useEffect, useState} from "react";
import {useMobileCheck} from "~/utils/hooks/useMobileCheck";
import {SessionContext} from "~/utils/context/SocketContext";
import {useSession} from "next-auth/react";
import { VideoSocketContext } from '~/utils/context/VideoContext';
import VideoCallPlayer from "~/components/videoCallComponents/VideoCallPlayer";

const MessageMain = () => {
  const [showCreateChatForm, setShowCreateChatForm] = useState(true);
  const {data: session, status, update} = useSession();
  const isMobile = useMobileCheck();

  const sessionId = useContext(SessionContext);
  const {isVideoChatVisible} = useContext(VideoSocketContext);

  useEffect(() => {
    if (!sessionId) {
      update()
    }
  }, [sessionId])

  useEffect(() => {
    if (isMobile) {
      setShowCreateChatForm(true)
    }
    return () => false;
  }, [isMobile]);

  return (
    <>
      {sessionId ? (
        <SplitPane className='w-[100dvw] flex -mt-[40px]' >
          <SplitPaneLeft>
            {showCreateChatForm && isMobile ? (
              <Messages
                sessionUserId={sessionId}
                closeForm={() => setShowCreateChatForm(false)}
              />
            ) : (!showCreateChatForm || !isMobile) && (
              <Sidebar
                sessionUserId={sessionId}
                openForm={() => setShowCreateChatForm(true)}
              />
            )}
          </SplitPaneLeft>
          <Divider className="hidden mob:flex border border-gray-400 rounded-md mx-1 hover:cursor-col-resize" />
          {(!isMobile || !showCreateChatForm) && (
            <SplitPaneRight>
              <Messages
                sessionUserId={sessionId}
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