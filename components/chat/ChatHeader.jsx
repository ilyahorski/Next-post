import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { SlCallOut, SlCallEnd } from "react-icons/sl";
import { BsThreeDotsVertical } from "react-icons/bs";

const ChatHeader = ({
  chat,
  sessionUserId,
  userStatuses,
  isVideoChatVisible,
  onToggleVideoChat,
  onOpenSettings,
  popoverRef,
}) => {
  const router = useRouter();

  if (!chat || chat.length === 0) return null;

  return (
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
          <div className="flex items-center w-full max-h-[90px] p-1 gap-2">
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
                onClick={onToggleVideoChat}
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
                onClick={onOpenSettings}
                ref={popoverRef}
              >
                <BsThreeDotsVertical
                  className="w-[20px] h-[20px]"
                  placeholder="Open video chat"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
