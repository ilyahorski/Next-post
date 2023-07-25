'use client'

import Sidebar from "~/components/Sidebar";
import Messages from "~/components/Messages";
import SplitPane, { SplitPaneLeft, SplitPaneRight, Divider } from '~/components/Splitter';
import {useEffect, useState} from "react";
import {useMobileCheck} from "~/utils/hooks/useMobileCheck";

const users = Array.from({length: 50}, (_, i) => ({
  id: i,
  email: `user${i}@example.com`,
  username: `Пользователь ${i}`,
  image: `https://picsum.photos/id/${i + 10}/200/300`,
  userImage: `https://picsum.photos/id/${i + 20}/200/300`,
  session: `session${i}`,
  socketId: `socketId${i}`,
  status: i % 2 === 0 ? 'online' : 'offline', // делаем половину пользователей онлайн, а половину - офлайн
  blockedUsers: [],
}));

// Mock chats
const chats = Array.from({length: 50}, (_, i) => ({
  id: `chatid${i}`,
  creatorId: users[i],
  membersList: [users[i], users[(i + 1) % users.length]],
  chatName: `Чат ${i}`,
  lastMessage: `Последнее сообщение чата ${i}`,
  secretToken: `Секретный токен ${i}`,
}));

const user = Array.from({length: 2}, (_, i) => ({
  _id: `userid${i}`,
  email: `user${i}@example.com`,
  username: `Пользователь ${i}`,
  image: `https://picsum.photos/id/${i + 10}/200/300`,
  userImage: `https://picsum.photos/id/${i + 20}/200/300`,
  session: `session${i}`,
  socketId: `socketId${i}`,
  status: 'online',
  blockedUsers: [],
}));

// Mock chat
const chat = {
  _id: 'chatid0',
  creatorId: user[0]._id,
  membersList: [user[0]._id, user[1]._id],
  chatName: 'Чат 0',
  lastMessage: null, // Пока что нет последнего сообщения
  secretToken: 'Секретный токен 0',
};

// Mock messages
const messages = Array.from({length: 10}, (_, i) => ({
  _id: `messageid${i}`,
  writerId: user[i % 2]._id,
  chatId: chat._id,
  message: `lorem ipsum dolor sit amet, consectetur adip  id  elit. Lorem ipsum dolor sit amet  con         etiam. Lorem ipsum dolor sit amet con etiam et euismod. Lorem ipsum dolor sit amet  con etiam et euismod  et euismod  tempor ${i}`,
  messageStatus: 'sent',
  deletedBy: null,
  createdAt: new Date(Date.now() - i * 1000 * 60 * 60),
}));

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
            user={user}
            chat={chat}
            messages={messages}
            closeForm={() => setShowCreateChatForm(false)}
          />
        ) : (!showCreateChatForm || !isMobile) && (
          <Sidebar
            chats={chats}
            openForm={() => setShowCreateChatForm(true)}
          />
        )}
      </SplitPaneLeft>
      <Divider className="hidden mob:flex border border-gray-400 rounded-md cursor-col-resize" />
      {(!isMobile || !showCreateChatForm) && (
        <SplitPaneRight>
          <Messages
            user={user}
            chat={chat}
            messages={messages}
          />
        </SplitPaneRight>
      )}
    </SplitPane>
  );
};

export default MessageMain;



