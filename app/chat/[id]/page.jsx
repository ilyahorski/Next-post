'use client'

import Sidebar from "~/components/Sidebar";
import Messages from "~/components/Messages";
import SplitPane, { SplitPaneLeft, SplitPaneRight, Divider } from '~/components/Splitter';
import { useContext, useState, useEffect } from "react";
import { useMobileCheck } from "~/utils/hooks/useMobileCheck";
import { SessionContext } from "~/utils/context/SocketContext";
import { VideoSocketContext } from '~/utils/context/VideoContext';
import VideoCallPlayer from "~/components/videoCallComponents/VideoCallPlayer";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "~/components/Loading";

const MessageMain = () => {
  const [showCreateChatForm, setShowCreateChatForm] = useState(true);
  const isMobile = useMobileCheck();
  const sessionId = useContext(SessionContext);
  const { isVideoChatVisible } = useContext(VideoSocketContext);
  const { id: chatId } = useParams();

  const fetchChatMembers = async () => {
    if (!chatId) return [];
    const response = await fetch(`/api/chats/${chatId}`);
    const data = await response.json();
    return data.membersList.map(ids => ids._id);
  };

  const { data: chatMembers = [], isLoading } = useQuery({
    queryKey: ['chatMembers', chatId],
    queryFn: fetchChatMembers,
    enabled: !!chatId && !!sessionId,
    staleTime: 300000,
    gcTime: 7200000,
  });

  useEffect(() => {
    if (isMobile) {
      setShowCreateChatForm(true);
    }
  }, [isMobile]);

  const isMember = chatMembers.includes(sessionId);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {sessionId && !!chatMembers.length ? (
        <SplitPane className='w-[100dvw] flex -mt-[40px]'>
          <SplitPaneLeft>
            {showCreateChatForm && isMobile ? (
              chatMembers && isMember ? (
                <Messages
                  sessionUserId={sessionId}
                  closeForm={() => setShowCreateChatForm(false)}
                />
              ) : (
                <div className="text-center font-normal text-[14px] my-1 text-black dark:text-zinc-100">
                  This is a private conversation, please log in with another account.
                </div>
              )
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
              {chatMembers && isMember ? (
                <Messages
                  sessionUserId={sessionId}
                />
              ) : (
                <div className="text-center font-normal text-[14px] my-1 text-black dark:text-zinc-100">
                  This is a private conversation, please log in with another account.
                </div>
              )}
            </SplitPaneRight>
          )}
          {isVideoChatVisible && <VideoCallPlayer />}
        </SplitPane>
      ) : (
        <div>
          No chat data available.
        </div>
      )}
    </>
  );
};

export default MessageMain;