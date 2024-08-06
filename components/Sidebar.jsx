"use client";

import { useContext, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { PiUsersThin } from "react-icons/pi";
import { SessionContext, MessageContext } from "~/utils/context/SocketContext";
import { format, parseISO } from "date-fns";

const Sidebar = ({ sessionUserId, openForm }) => {
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const sessionId = useContext(SessionContext);
  // const { unseenMessage } = useContext(MessageContext);
  const [time, setTime] = useState(0);

  const getChats = useCallback(async () => {
    if (!sessionId) return;

    const response = await fetch('/api/chats', {
      headers: {
        userId: sessionId,
      },
    });

    const data = await response.json();

    setChats(data);
  }, [sessionId]);

  useEffect(() => {
    getChats();

    const intervalId = setInterval(() => {
      getChats();
      setTime(time + 1);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [getChats]);

  const filteredChats = chats.filter((chat) =>
    chat?.chatName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <form className="flex-1 w-full px-1 custom-height">
      <div className="flex gap-1 items-start">
        <input
          className="w-full dark:bg-gray-600/10 p-2 mb-3 rounded"
          placeholder="Find chats"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className={`mob:hidden flex justify-center items-center w-[40px] h-[40px] ${
            chats.length === 0 ? "blink" : ""
          }`}
          type="button"
          onClick={openForm}
        >
          <div className="flex gap-0.5 items-center flex-col">
            <PiUsersThin
              className="text-emerald-700 w-[30px] h-[30px]"
              placeholder="Open users list"
            />
            <p className="text-emerald-700 font-normal text-6xs">Users</p>
          </div>
        </button>
      </div>
      {filteredChats.length > 0 && sessionUserId ? (
        <div className="chat-list">
          {filteredChats.map((chat, index) => (
            <Link
              href={`/chat/${chat._id}`}
              key={chat._id}
              className={
                "flex flex-row relative justify-between flex-wrap p-2 m-1 items-start gap-2 border-b border-primary-300"
              }
            >
              <div className="flex gap-2 justify-start items-center">
                <Image
                  src={
                    chat?.chatImage
                      ? chat.chatImage
                      : sessionUserId === chat?.membersList[0]._id
                      ? chat?.membersList[1].userImage ||
                        chat?.membersList[1].image
                      : chat?.membersList[0].userImage ||
                        chat?.membersList[0].image
                  }
                  alt="user_image"
                  width={50}
                  height={50}
                  className="rounded-full object-fill h-[50px] w-[50px]"
                />
                <div className="flex flex-col gap-2">
                  <p className="">{chat.chatName}</p>
                  {chat?.lastMessage?.createdAt && (
                    <span
                      className={`absolute top-1 right-1 font-normal text-[10px] mt-1 text-white min-w-[30px]`}
                    >
                      {format(
                        parseISO(chat.lastMessage.createdAt),
                        "HH:mm, PPP"
                      )}
                    </span>
                  )}
                  <div className="flex max-w-[300px]">
                    <p className="truncate">{chat?.lastMessage?.message ? chat?.lastMessage?.message : 'New media'}</p>
                    {/* <p className="flex items-center justify-center absolute bottom-2 right-1 w-[20px] h-[20px] text-[10px] font-normal rounded-full border border-red-400">{unseenMessage}</p> */}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center mt-5">
          <p className="text-gray-700 dark:text-gray-300">
            You don't have any chats. Create a dialogue and start communicating!
          </p>
        </div>
      )}
    </form>
  );
};

export default Sidebar;
