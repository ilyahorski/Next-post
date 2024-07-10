"use client";

import { useContext, useEffect, useState, useRef } from "react";
import MessageForm from "~/components/MessageForm";
import { useMobileCheck } from "~/utils/hooks/useMobileCheck";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { SocketContext } from "~/utils/context/SocketContext";
import { VideoSocketContext } from "~/utils/context/VideoContext";
import MessageList from "~/components/MessageList";
import { LoadingBar } from "~/components/Loading";
import InfiniteScroll from "react-infinite-scroll-component";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { BsPersonVideo } from "react-icons/bs";
import Image from "next/image";

const Messages = ({ sessionUserId, closeForm }) => {
  const { data: session, status } = useSession();
  const [chat, setChat] = useState(null);
  const [messagesList, setMessagesList] = useState([]);
  const [page, setPage] = useState(1);
  const [messagesCount, setMessagesCount] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const formEndRef = useRef(null);

  const isMobile = useMobileCheck();
  const { id: chatId } = useParams();

  const socket = useContext(SocketContext);
  const { isVideoChatVisible, setIsVideoChatVisible } =
    useContext(VideoSocketContext);

  const getMessages = async () => {
    if (messagesList.length >= messagesCount) {
      setHasMore(false);
      return;
    }
    const response = await fetch(`/api/message?page=${page}&limit=20`, {
      headers: {
        chatId: chatId,
      },
    });
    const data = await response.json();

    setMessagesCount(data.totalMessages);
    setPage(page + 1);
    setMessagesList((prevMessages) => [...prevMessages, ...data.usersMessages]);
  };

  useEffect(() => {
    if (status === "loading" && !chatId) return;

    const getChat = async () => {
      const response = await fetch(`/api/chats/${chatId}`);
      const data = await response.json();

      setChat(data);
    };

    if (chatId) {
      getChat();
    }
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;

    if (chatId && chat) getMessages();
  }, [chatId, chat]);

  useEffect(() => {
    if (chatId && socket) {
      socket.emit("getMessages", { chatId });

      socket.on("newMessage", (message) => {
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
        socket.off("newMessage");
      };
    }
  }, [session, socket, chatId]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const openedFromPush = urlParams.get("source") === "push";
    const actionType = urlParams.get("type") === "reject";

    if (openedFromPush && !actionType) {
      setIsVideoChatVisible(!isVideoChatVisible);
    }
  }, []);

  const scrollToBottom = () => {
    if (formEndRef.current) {
      formEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "end",
      });
    }
  };

  useEffect(() => {
    if (messagesList.length > 0) {
      scrollToBottom();
    }
  }, [messagesList]);

  return (
    <div className="flex flex-col custom-height flex-grow  pb-3 w-full relative" ref={formEndRef}>
      {chat && chat?.length !== 0 && sessionUserId && (
        <div className="flex gap-1 flex-grow w-full items-center">
          <button
            className="mob:hidden flex justify-center items-center w-[40px] h-[40px]"
            type="button"
            onClick={closeForm}
          >
            <div className="flex gap-0.5 items-center flex-col">
              <HiOutlineChatBubbleLeftRight
                className="text-emerald-700 w-[30px] h-[30px]"
                placeholder="Open chats list"
              />
              <p className="text-emerald-700 font-normal text-6xs">Chats</p>
            </div>
          </button>
          <div className="flex justify-between items-center flex-grow w-full gap-2 px-1 mt-auto rounded-md mb-auto bg-gray-600/20 bg-clip-padding backdrop-filter backdrop-blur-lg">
            <div className="flex items-center">
              <div className="flex items-center  w-full max-h-[90px] p-1 gap-2 ">
                <Image
                  src={
                    chat?.chatImage
                      ? chat?.chatImage
                      : sessionUserId === chat?.membersList[0]._id
                      ? chat?.membersList[1].userImage ||
                        chat?.membersList[1].image
                      : chat?.membersList[0].userImage ||
                        chat?.membersList[0].image
                  }
                  alt="chat_image"
                  width={40}
                  height={40}
                  className="rounded-full object-fill h-[40px] w-[40px]"
                />
                <div className="flex h-[50px] max-w-[250px] us:max-w-[400px] xl:max-w-[750px] flex-col gap-0.5 py-0.5">
                  <p className="h-[20px]">{chat?.chatName}</p>
                  {messagesList[0] && (
                    <p className="truncate h-[20px]">
                      {messagesList[0]?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              title="Open video chat"
              className="flex gap-0.5 items-center flex-col cursor-pointer text-zinc-800 dark:text-zinc-400"
              type="button"
              onClick={() => setIsVideoChatVisible(!isVideoChatVisible)}
            >
              <BsPersonVideo
                className="w-[30px] h-[30px] md:w-[40px] md:h-[40px]"
                placeholder="Open video chat"
              />
              <span className="font-normal text-6xs text-center">
                Video call
              </span>
            </button>
          </div>
        </div>
      )}
      <section
        className="scrollableDiv w-full max-w-full min-w-0 flex-grow relative"
        id="scrollableDiv"
        style={{
          maxHeight: "93%",
          height: "93%",
          overflow: "auto",
          display: "flex",
          flexDirection: "column-reverse",
          marginBottom: "5px",
          marginTop: "5px",
        }}
      >
        <InfiniteScroll
          style={{ display: "flex", flexDirection: "column-reverse" }}
          dataLength={messagesList?.length}
          next={getMessages}
          hasMore={hasMore}
          loader={<LoadingBar isMessage={true} />}
          refreshFunction={getMessages}
          scrollableTarget="scrollableDiv"
          scrollThreshold="200px"
          inverse={true}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>You have seen it all</b>
            </p>
          }
        >
          <MessageList
            messagesList={messagesList}
            isMobile={isMobile}
            sessionUserId={sessionUserId}
            scrollToBottom={scrollToBottom}
          />
        </InfiniteScroll>
      </section>

      <div className="flex items-center w-full gap-2 mt-auto relative">
        <MessageForm id={chatId} chat={chat} sessionUserId={sessionUserId} formEndRef={formEndRef} scrollToBottom={scrollToBottom}/>
      </div>
      <div ref={formEndRef} />
    </div>
  );
};

export default Messages;