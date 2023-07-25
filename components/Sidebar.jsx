'use client'

import {useEffect, useState} from 'react';
import Link from "next/link";
import Image from "next/image";
import {RxHamburgerMenu} from "react-icons/rx";
import {useSession} from "next-auth/react";

const Sidebar = ({ openForm }) => {
  const { data: session, status } = useSession();
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (status === 'loading') return;

    const getChats = async () => {
      const response = await fetch(`/api/chats`);
      const data = await response.json();

      setChats(data);
    };

    if (session) getChats();

  }, [session]);

  const filteredChats = chats.filter((chat) =>
    chat.chatName.toLowerCase().includes(search.toLowerCase())
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
          <RxHamburgerMenu className='text-primary-300 w-[40px] h-[40px]' />
        </button>
      </div>
      <div className='chat-list'>
        {filteredChats.map((chat, index) => (
          <Link href={`/chat/${chat.id}`}
            key={chat.id}
            className={'flex flex-row justify-between flex-wrap p-2 m-1 items-start gap-2 border-b border-primary-300'}>
            <div
              className='flex gap-2 justify-start items-center'
            >
              <Image
                src={chat.creatorId.userImage}
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
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </form>
  );
};

export default Sidebar;
