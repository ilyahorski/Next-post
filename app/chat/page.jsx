'use client'

import Sidebar from "~/components/Sidebar";
import CreateChatForm from "~/components/CreateChatForm";
import SplitPane, { SplitPaneLeft, SplitPaneRight, Divider } from '~/components/Splitter';
import {useContext, useEffect, useState} from "react";
import {useMobileCheck} from "~/utils/hooks/useMobileCheck";
import {SessionContext} from "~/utils/context/SocketContext";
import { Loader } from "~/components/Loading";

const ChatMain = () => {
  const [showCreateChatForm, setShowCreateChatForm] = useState(false);
  const isMobile = useMobileCheck();

  const sessionId = useContext(SessionContext);

  useEffect(() => {
    if (isMobile) {
      setShowCreateChatForm(false)
    }
    return () => false;
  }, [isMobile]);

  return (
    <>
      {sessionId ? (
        <SplitPane className='w-[100dvw] flex -mt-[40px]' >
          <SplitPaneLeft>
            {showCreateChatForm && isMobile ? (
              <CreateChatForm
                closeForm={() => setShowCreateChatForm(false)} 
              />
            ) : (!showCreateChatForm || !isMobile) && (
              <Sidebar
                sessionUserId={sessionId}
                openForm={() => setShowCreateChatForm(true)} 
              />
            )}
          </SplitPaneLeft>
          <Divider className="hidden mob:flex border border-gray-400 rounded-md cursor-col-resize" />
          {(!isMobile || !showCreateChatForm) && (
            <SplitPaneRight>
              <CreateChatForm />
            </SplitPaneRight>
          )}
        </SplitPane>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ChatMain;
