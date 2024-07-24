'use client'

import Sidebar from "~/components/Sidebar";
import Messages from "~/components/Messages";
import SplitPane, { SplitPaneLeft, SplitPaneRight, Divider } from '~/components/Splitter';
import {useContext, useEffect, useState} from "react";
import {useMobileCheck} from "~/utils/hooks/useMobileCheck";
import {SessionContext} from "~/utils/context/SocketContext";
import { VideoSocketContext } from '~/utils/context/VideoContext';
import VideoCallPlayer from "~/components/videoCallComponents/VideoCallPlayer";
import { useParams } from "next/navigation";

const MessageMain = () => {
  const [showCreateChatForm, setShowCreateChatForm] = useState(true);
  const isMobile = useMobileCheck();
  
  const [chatMembers, setChatMembers] = useState([]);
  const { id: chatId } = useParams();

  const sessionId = useContext(SessionContext);
  const {isVideoChatVisible} = useContext(VideoSocketContext);

  useEffect(() => {
    if (isMobile) {
      setShowCreateChatForm(true)
    }
    return () => false;
  }, [isMobile]);

  useEffect(() => {
    if (!chatId) return;
    const getChat = async () => {
      const response = await fetch(`/api/chats/${chatId}`);
      const data = await response.json();

      setChatMembers(data.membersList.map(ids => ids._id));
    };

    if (chatId) {
      getChat();
    }
  }, [chatId, sessionId]);

  const isMember = chatMembers.includes(sessionId);

  return (
    <>
      {sessionId && chatMembers.length > 0 ? (
        <SplitPane className='w-[100dvw] flex -mt-[40px]' >
          <SplitPaneLeft>
            {showCreateChatForm && isMobile ? (
              chatMembers && isMember ? (
                <Messages
                  sessionUserId={sessionId}
                  closeForm={() => setShowCreateChatForm(false)}
                />
              ) : (
                <div className="text-center font-normal text-[14px] my-1 text-black dark:text-zinc-100">
                  Это приватный диалог, войдите под другим аккаунтом.
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
                  Это приватный диалог, войдите под другим аккаунтом.
                </div>
              )}
            </SplitPaneRight>
          )}
          {isVideoChatVisible && <VideoCallPlayer />}
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
