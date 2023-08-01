'use client'

import Sidebar from "~/components/Sidebar";
import CreateChatForm from "~/components/CreateChatForm";
import SplitPane, { SplitPaneLeft, SplitPaneRight, Divider } from '~/components/Splitter';
import {useContext, useEffect, useState} from "react";
import {useMobileCheck} from "~/utils/hooks/useMobileCheck";
import {useSession} from "next-auth/react";
import {SessionContext} from "~/utils/context/SocketContext";
import Messages from "~/components/Messages";

const ChatMain = () => {
  const [showCreateChatForm, setShowCreateChatForm] = useState(true);
  const {data: session, status, update} = useSession();
  const isMobile = useMobileCheck();

  const sessionId = useContext(SessionContext);

  useEffect(() => {
    if (!session?.user) {
      update()
    }
  }, [session])

  useEffect(() => {
    if (isMobile) {
      setShowCreateChatForm(true)
    }
    return () => false;
  }, []);

  return (
    <>
      {sessionId ? (
        <SplitPane className='w-[100dvw] flex -mt-[40px]' >
          <SplitPaneLeft>
            {showCreateChatForm && isMobile ? (
              <CreateChatForm
                closeForm={() => setShowCreateChatForm(false)} // функция для закрытия формы
              />
            ) : (!showCreateChatForm || !isMobile) && (
              <Sidebar
                sessionUserId={sessionId}
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
      ) : (
        <div>
          Loading ...
        </div>
      )}
    </>
  );
};

export default ChatMain;
