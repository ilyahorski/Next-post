'use client'

import {useContext, useEffect, useState} from 'react';
import Link from "next/link";
import Image from "next/image";
import {useSession} from "next-auth/react";
import {GoSidebarCollapse} from "react-icons/go";
import {SocketContext} from "~/utils/context/SocketContext";
import {usePathname} from "next/navigation";

const Sidebar = ({ openForm }) => {
  const { data: session, status } = useSession();
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState('');
  const [isFetchingChats, setIsFetchingChats] = useState(false);
  const pathname = usePathname()

  const socket = useContext(SocketContext);

  useEffect(() => {
    if (status === 'loading' || isFetchingChats) return;

    const getChats = async () => {
      setIsFetchingChats(true);
      const response = await fetch(`/api/chats`, {
        headers: {
          'userId': session?.user?.id
        }
      });

      const data = await response.json();

      setChats(data);
      setIsFetchingChats(false);
    };

    if (session?.user?.id && !isFetchingChats) getChats();

  }, [session, isFetchingChats, pathname]);

  useEffect(() => {
    if (!session?.user && !socket) return;

    if (socket) {
      socket.on('chatUpdated', (updatedChat) => {
        setChats((prevChats) => [...prevChats, updatedChat]);
      });

      return () => {
        socket.off('chatUpdated');
      };
    }
  }, [session?.user, socket]);


  const filteredChats = chats.filter((chat) =>
    chat?.chatName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <form className="flex-1 w-full px-1 custom-height">
      <div className='flex gap-1 items-start'>
        <input
          className="w-full p-2 mb-3 rounded"
          placeholder="Find chats"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className='mob:hidden flex justify-center items-center w-[40px] h-[40px]'
          type="submit"
          onClick={openForm}
        >
          <GoSidebarCollapse className='text-primary-300 w-[40px] h-[40px]' />
        </button>
      </div>
      {filteredChats.length !== 0 && (
          <div className='chat-list'>
            {filteredChats.map((chat, index) => (
                <Link href={`/chat/${chat._id}`}
                      key={chat._id}
                      className={'flex flex-row justify-between flex-wrap p-2 m-1 items-start gap-2 border-b border-primary-300'}>
                  <div
                      className='flex gap-2 justify-start items-center'
                  >
                    <Image
                        src={
                          chat?.chatImage
                              ? chat.chatImage
                              : (session?.user?.id === chat?.membersList[0]._id
                                  ? (chat?.membersList[1].userImage || chat?.membersList[1].image)
                                  : (chat?.membersList[0].userImage || chat?.membersList[0].image))
                        }
                        alt='user_image'
                        width={50}
                        height={50}
                        className='rounded-full object-fill h-[50px] w-[50px]'
                    />
                    <div className='flex flex-col gap-2'>
                      <p className=''>
                        {chat.chatName}
                      </p>
                      <p className=''>
                        {chat?.lastMessage?.message}
                      </p>
                    </div>
                  </div>
                </Link>
            ))}
          </div>
      )}
    </form>
  );
};

export default Sidebar;
