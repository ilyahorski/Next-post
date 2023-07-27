'use client'

import Sidebar from "~/components/Sidebar";
import Messages from "~/components/Messages";
import SplitPane, { SplitPaneLeft, SplitPaneRight, Divider } from '~/components/Splitter';
import {useEffect, useState} from "react";
import {useMobileCheck} from "~/utils/hooks/useMobileCheck";

const MessageMain = () => {
  const [showCreateChatForm, setShowCreateChatForm] = useState(true);
  const isMobile = useMobileCheck();

  useEffect(() => {
    if (isMobile) {
      setShowCreateChatForm(true)
    }
    return () => false;
  }, []);

  return (
    <SplitPane className='w-[100dvw] flex -mt-[40px]' >
      <SplitPaneLeft>
        {showCreateChatForm && isMobile ? (
          <Messages
            closeForm={() => setShowCreateChatForm(false)}
          />
        ) : (!showCreateChatForm || !isMobile) && (
          <Sidebar
            openForm={() => setShowCreateChatForm(true)}
          />
        )}
      </SplitPaneLeft>
      <Divider className="hidden mob:flex border border-gray-400 rounded-md cursor-col-resize" />
      {(!isMobile || !showCreateChatForm) && (
        <SplitPaneRight>
          <Messages />
        </SplitPaneRight>
      )}
    </SplitPane>
  );
};

export default MessageMain;



