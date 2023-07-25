'use client'

import Sidebar from "~/components/Sidebar";
import CreateChatForm from "~/components/CreateChatForm";
import SplitPane, { SplitPaneLeft, SplitPaneRight, Divider } from '~/components/Splitter';
import {useEffect, useState} from "react";
import {useMobileCheck} from "~/utils/hooks/useMobileCheck";

const ChatMain = () => {
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
          <CreateChatForm
            closeForm={() => setShowCreateChatForm(false)} // функция для закрытия формы
          />
        ) : (!showCreateChatForm || !isMobile) && (
          <Sidebar
            openForm={() => setShowCreateChatForm(true)} // функция для открытия формы
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
  );
};

export default ChatMain;
