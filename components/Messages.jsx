'use client'

import {useContext, useEffect, useState} from 'react';
import MessageForm from "~/components/MessageForm";
import {useMobileCheck} from "~/utils/hooks/useMobileCheck";
import {useSession} from "next-auth/react";
import {useParams, usePathname} from "next/navigation";
import {SocketContext} from "~/utils/context/SocketContext";
import MessageList from "~/components/MessageList";
import {LoadingBar} from "~/components/Loading";
import InfiniteScroll from "react-infinite-scroll-component";
import {GoSidebarExpand} from "react-icons/go";
import Image from "next/image";

const Messages = ({ closeForm }) => {
  const {data: session, status} = useSession();
  const [chat, setChat] = useState(null);
  const [messagesList, setMessagesList] = useState([]);
  const [page, setPage] = useState(1);
  const [messagesCount, setMessagesCount] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  const isMobile = useMobileCheck();
  const pathname = usePathname()
  const {id: chatId} = useParams()

  const socket = useContext(SocketContext);

  const getMessages = async () => {
    if (messagesList.length >= messagesCount) {
      setHasMore(false);
      return;
    }
    setIsFetchingMessages(true);
    const response = await fetch(`/api/message?page=${page}&limit=20`, {
      headers: {
        'chatId': chatId
      }
    });
    const data = await response.json();

    setMessagesCount(data.totalMessages)
    setPage(page + 1);
    setMessagesList(prevMessages => [...prevMessages, ...data.usersMessages]);
    setIsFetchingMessages(false);
  };

  useEffect(() => {
    if (!chatId) return;

    if ( chatId && chat) getMessages();

  }, [chatId, pathname, chat]);


  useEffect(() => {
    if (status === 'loading' && !chatId) return;

    const getChat = async () => {
      const response = await fetch(`/api/chats/${chatId}`);
      const data = await response.json();

      setChat(data);
    };

    if (chatId) getChat();

  }, [chatId]);

  useEffect(() => {
    if (chatId && socket) {
      socket.emit('getMessages', {chatId});

      socket.on('newMessage', (message) => {
        if (message.chatId === chatId) {
          setMessagesList((prevMessages) => {
            const commentIds = new Set(prevMessages.map((c) => c._id));
            if (commentIds.has(message._id)) {
              return prevMessages;
            } else {
              return [message, ...prevMessages];
            }
          });
        }
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [session, socket, chatId]);

  return (
    <div className="flex flex-col custom-height flex-grow px-2 pb-3 w-full">
      {chat && chat.length !== 0 && (
        <div className='flex items-center flex-grow gap-2 mt-auto rounded mb-auto bg-gray-300/20 bg-clip-padding backdrop-blur-lg backdrop-filter'>
          <button
            className='mob:hidden flex justify-center items-center w-[40px] h-[40px]'
            type="submit"
            onClick={closeForm}
          >
            <GoSidebarExpand className='text-primary-300 w-[40px] h-[40px]' />
          </button>
          <div className='flex items-center w-full max-h-[50px] p-1 gap-2'>
            <Image
              src={
                chat?.chatImage
                  ? chat?.chatImage
                  : (session?.user?.id === chat?.membersList[0]._id
                    ? (chat?.membersList[1].userImage || chat?.membersList[1].image)
                    : (chat?.membersList[0].userImage || chat?.membersList[0].image))
              }
              alt='chat_image'
              width={50}
              height={50}
              className='rounded-full object-fill h-[50px] w-[50px]'
            />
            <div className='flex max-w-[250px] us:max-w-[400px] xl:max-w-[750px] flex-col gap-1'>
              <p className=''>
                {chat?.chatName}
              </p>
              {messagesList[0] && (
                <p className='truncate'>
                  {messagesList[0]?.message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      <section
        className="scrollableDiv w-full max-w-full min-w-0 flex-grow"
        id="scrollableDiv"
        style={{
          maxHeight: '93%',
          height: '93%',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column-reverse',
          marginBottom: '5px',
          marginTop: '5px',
        }}
      >
        <InfiniteScroll
          style={{ display: 'flex', flexDirection: 'column-reverse' }}
          dataLength={messagesList?.length}
          next={getMessages}
          hasMore={hasMore}
          loader={<LoadingBar isMessage={true}/>}
          refreshFunction={getMessages}
          scrollableTarget="scrollableDiv"
          scrollThreshold="200px"
          inverse={true}
          endMessage={
            <p style={{textAlign: "center"}}>
              <b>You have seen it all</b>
            </p>
          }
        >
          <MessageList messagesList={messagesList} isMobile={isMobile} session={session} />
        </InfiniteScroll>
      </section>

      <div className='flex items-center w-full gap-2 mt-auto'>
        <MessageForm
          id={chatId}
          chat={chat}
          session={session}
        />
      </div>
    </div>
  );
};

export default Messages;


