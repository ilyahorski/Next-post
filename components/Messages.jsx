"use client";

import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import {
  useInfiniteQuery,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import MessageForm from "~/components/MessageForm";
import { useMobileCheck } from "~/utils/hooks/useMobileCheck";
import { SocketContext } from "~/utils/context/SocketContext";
import { VideoSocketContext } from "~/utils/context/VideoContext";
import MessageList from "~/components/MessageList";
import SettingsPopover from "~/components/SettingsPopover";
import { Loader } from "~/components/Loading";
import { FaArrowLeft } from "react-icons/fa6";
import { SlCallOut, SlCallEnd } from "react-icons/sl";
import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";

const Messages = ({ sessionUserId }) => {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [background, setBackground] = useState("/assets/bg/1.jpg");
  const [userStatuses, setUserStatuses] = useState({});
  const [replyTo, setReplyTo] = useState(null);
  const [newMessageGet, setNewMessageGet] = useState(false);
  const [newMessages, setNewMessages] = useState([]);
  const formEndRef = useRef(null);
  const messageEndRef = useRef(null);
  const popoverRef = useRef(null);

  const isMobile = useMobileCheck();
  const { id: chatId } = useParams();
  const router = useRouter();

  const socket = useContext(SocketContext);
  const { isVideoChatVisible, setIsVideoChatVisible } =
    useContext(VideoSocketContext);
  const queryClient = useQueryClient();

  const fetchMessages = async ({ pageParam = 1 }) => {
    const response = await fetch(`/api/message?page=${pageParam}&limit=100`, {
      headers: { chatId },
    });
    const data = await response.json();
    return data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["messages", chatId],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.usersMessages.length < 100) return undefined;
        return pages.length + 1;
      },
      enabled: !!chatId,
    });

  const messagesList = data
    ? data.pages.flatMap((page) => page.usersMessages)
    : [];

  const fetchChat = async (chatId) => {
    const response = await fetch(`/api/chats/${chatId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const {
    data: chat,
    error,
    isLoading,
  } = useQuery(["chat", chatId], () => fetchChat(chatId), {
    enabled: !!chatId, // Запрос выполняется только при наличии chatId
    refetchOnWindowFocus: false, // Отключаем повторный запрос при фокусе на окно
  });

  const updateMessages = useCallback((newMessage) => {
    setNewMessageGet(true);
    queryClient.setQueryData(["messages", chatId], (oldData) => {
      if (!oldData) {
        return { pages: [{ usersMessages: [newMessage] }], pageParams: [1] };
      }
      
      const messageExists = oldData.pages.some(page => 
        page.usersMessages.some(msg => msg._id === newMessage._id)
      );
      
      if (messageExists) {
        return oldData;
      }
      
      return {
        ...oldData,
        pages: [
          { usersMessages: [newMessage, ...oldData.pages[0].usersMessages] },
          ...oldData.pages.slice(1),
        ],
      };
    });
  }, [queryClient, chatId]);

  useEffect(() => {
    if (chatId && socket && sessionUserId) {
      socket.emit("getMessages", { chatId });
      socket.emit("markMessagesAsDelivered", { chatId, userId: sessionUserId });

      const updateStatus = (status) => {
        socket.emit("setUserStatus", { userId: sessionUserId, status });
      };

      const handleVisibilityChange = () => {
        if (document.hidden) {
          updateStatus("offline");
        } else {
          updateStatus("online");
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("focus", () => updateStatus("online"));
      window.addEventListener("blur", () => updateStatus("offline"));
      updateStatus("online");

      const statusInterval = setInterval(() => updateStatus("online"), 10000);

      const handleNewMessage = (message) => {
        if (message.chatId === chatId) {
          setNewMessages(prev => [...prev, message]);
          updateMessages(message);
          socket.emit("markMessageAsDelivered", {
            messageId: message._id,
            chatId,
          });
          setNewMessageGet(false);
        }
      };

      socket.on("newMessage", handleNewMessage);

      socket.on("messageStatusUpdated", (updatedMessage) => {
        queryClient.setQueryData(["messages", chatId], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              usersMessages: page.usersMessages.map((msg) =>
                msg._id === updatedMessage._id
                  ? { ...msg, messageStatus: updatedMessage.messageStatus }
                  : msg
              ),
            })),
          };
        });
      });

      socket.on("messageUpdated", (updatedMessage) => {
        if (updatedMessage && updatedMessage._id) {
          queryClient.setQueryData(["messages", chatId], (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                usersMessages: page.usersMessages.map((msg) =>
                  msg._id === updatedMessage._id
                    ? { ...msg, message: updatedMessage.message }
                    : msg
                ),
              })),
            };
          });
        } else {
          console.error("Received invalid updated message:", updatedMessage);
        }
      });

      socket.on("messageDeleted", ({ messageId }) => {
        queryClient.setQueryData(["messages", chatId], (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              usersMessages: page.usersMessages.filter(
                (msg) => msg._id !== messageId
              ),
            })),
          };
        });
      });

      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.off("messageStatusUpdated");
        socket.off("messageUpdated");
        socket.off("messageDeleted");
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        window.removeEventListener("focus", () => updateStatus("online"));
        window.removeEventListener("blur", () => updateStatus("offline"));
        clearInterval(statusInterval);
        updateStatus("offline");
      };
    }
  }, [socket, chatId, sessionUserId, queryClient]);

  useEffect(() => {
    if (newMessages.length > 0) {
      const timer = setTimeout(() => {
        setNewMessages([]);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [newMessages]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const openedFromPush = urlParams.get("source") === "push";
    const actionType = urlParams.get("type") === "reject";

    if (openedFromPush && !actionType) {
      setIsVideoChatVisible(!isVideoChatVisible);
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("userStatusUpdated", ({ userId, status, username }) => {
        setUserStatuses((prevStatuses) => ({
          ...prevStatuses,
          [userId]: { status, username },
        }));
      });

      return () => {
        socket.off("userStatusUpdated");
      };
    }
  }, [socket]);

  useEffect(() => {
    const storageKey = `chat-background-${chatId}`;
    const storedBackground = localStorage.getItem(storageKey);
    if (storedBackground) {
      setBackground(storedBackground);
    }
  }, [chatId]);

  useEffect(() => {
    let timeout;

    if (newMessageGet && messageEndRef.current && formEndRef.current) {
      const scrollMessageList = () => {
        return new Promise((resolve) => {
          window.requestAnimationFrame(() => {
            const messageList = document.getElementById("scrollableDiv");
            if (messageList) {
              messageEndRef.current.scrollIntoView({
                block: "end",
              });
              resolve();
            } else {
              resolve();
            }
          });
        });
      };

      const scrollEntireContainer = () => {
        window.requestAnimationFrame(() => {
          const container = document.getElementById("messagesContainer");
          if (container) {
            timeout = setTimeout(() => {
              window.requestAnimationFrame(() =>
                formEndRef.current.scrollIntoView({
                  block: "end",
                })
              );
            }, 200);
          }
        });
      };
      scrollMessageList().then(scrollEntireContainer);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [newMessageGet]);

  const handlePopoverClick = (event) => {
    event.stopPropagation();
    setIsSettingOpen(true);
  };

  const handleReply = (message) => {
    setReplyTo(message);
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div
      className="scrollableBg flex flex-col custom-height flex-grow w-full"
      style={{ "--scrollableDiv-background": `url(${background})` }}
    >
      {chat.length !== 0 && (
        <div className="flex gap-1 flex-grow w-full items-center bg-black rounded-t-md">
          <div className="flex items-center relative flex-grow w-full gap-2 px-1 mt-auto rounded-t-md mb-auto bg-gray-600/20 bg-clip-padding backdrop-filter backdrop-blur-lg">
            <button
              className="mob:hidden flex justify-center items-center w-[40px] h-[40px]"
              type="button"
              onClick={() => router.push("/chat")}
            >
              <div className="flex gap-0.5 items-center flex-col">
                <FaArrowLeft
                  className="text-zinc-400 w-[20px] h-[20px]"
                  placeholder="Open chats list"
                />
              </div>
            </button>
            <div className="flex w-full justify-between items-center">
              <div className="flex items-center  w-full max-h-[90px] p-1 gap-2 ">
                <Image
                  src={
                    chat?.chatImage
                      ? chat?.chatImage
                      : sessionUserId === chat?.membersList[0]._id
                      ? chat?.membersList[1]?.userImage ||
                        chat?.membersList[1]?.image
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
                  <div className="h-[20px] flex flex-wrap gap-2">
                    {chat?.membersList.map(
                      (member) =>
                        member._id !== sessionUserId && (
                          <span key={member._id} className="text-sm">
                            {member.username}:{" "}
                            {userStatuses[member._id]?.status || "offline"}
                          </span>
                        )
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {chat?.membersList.length > 1 && (
                  <button
                    title="Open video chat"
                    className="flex p-2 cursor-pointer text-zinc-800 dark:text-zinc-400"
                    type="button"
                    onClick={() => setIsVideoChatVisible(!isVideoChatVisible)}
                  >
                    {!isVideoChatVisible ? (
                      <SlCallOut
                        className="w-[20px] h-[20px]"
                        placeholder="Open video chat"
                      />
                    ) : (
                      <SlCallEnd
                        className="w-[20px] h-[20px] text-red-500"
                        placeholder="Close video chat"
                      />
                    )}
                  </button>
                )}

                <div className="w-full us:w-[100%] flex gap-2 justify-end items-end">
                  <button
                    title="Open chat settings"
                    className="flex p-2 cursor-pointer text-zinc-800 dark:text-zinc-400"
                    type="button"
                    onClick={handlePopoverClick}
                    ref={popoverRef}
                  >
                    <BsThreeDotsVertical
                      className="w-[20px] h-[20px]"
                      placeholder="Open video chat"
                    />
                  </button>
                  {isSettingOpen && (
                    <div className="absolute inset-0 top-0 flex items-start justify-end z-[1000]">
                      <SettingsPopover
                        popoverRef={popoverRef}
                        chat={chat}
                        setIsSettingOpen={isSettingOpen}
                        onClose={() => setIsSettingOpen(false)}
                        background={background}
                        setBackground={setBackground}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <section
        className={`scrollableDiv flex flex-col-reverse overflow-y-auto h-full w-full max-w-full min-w-0 flex-grow`}
        id="scrollableDiv"
      >
        <div className="flex-grow overflow-hidden">
          {status === "loading" ? (
            <Loader />
          ) : status === "error" ? (
            <p>Error loading messages</p>
          ) : (
            <MessageList
              messagesList={messagesList}
              isMobile={isMobile}
              sessionUserId={sessionUserId}
              onReply={handleReply}
              messageEndRef={messageEndRef}
              fetchNextPage={fetchNextPage}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
            />
          )}
        </div>
      </section>

      <div className="flex items-center w-full gap-2 mt-auto bg-black rounded-b-md">
        <MessageForm
          id={chatId}
          chat={chat}
          sessionUserId={sessionUserId}
          formEndRef={formEndRef}
          replyTo={replyTo}
          setReplyTo={setReplyTo}
          messageEndRef={messageEndRef}
        />
      </div>
    </div>
  );
};

export default Messages;
