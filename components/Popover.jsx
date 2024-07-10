
import { useRef } from "react";
import Link from "next/link";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { AiOutlineUserDelete } from "react-icons/ai";
import SubscribeToPush from "../components/pushNotification/SubscribeToPush";
import useClickOutside from "~/utils/hooks/useClickOutside";

const Popover = ({ handleDelete, session, setIsPopoverOpen, onClose  }) => {
  const popoverRef = useRef(null);

  useClickOutside(popoverRef, onClose);
  return (
    <div ref={popoverRef} className="bg-zinc-800 p-4 rounded-lg shadow-lg w-64 h-72 relative">
      <button className="absolute top-2 right-2" onClick={() => setIsPopoverOpen(false)}>
        ✖
      </button>
      <div className="flex flex-col items-start gap-4 mt-8">
        <Link
          href={"/create-post"}
          className="flex gap-4 text-[20px] font-light items-center cursor-pointer text-zinc-200 hover:text-zinc-300/60 active:text-zinc-400/60"
        >
          <MdOutlineLibraryAdd className="w-10 h-10" />
          <span>Create new post</span>
        </Link>
        <Link
          href={`/profile/edit/?id=${session}`}
          className="flex gap-4 text-[20px] font-light items-center cursor-pointer text-zinc-200 hover:text-zinc-300/60 active:text-zinc-400/60"
        >
          <CiEdit className="w-10 h-10" />
          <span>Edit your profile</span>
        </Link>
        <SubscribeToPush />
        <button
          className="flex gap-4 text-[20px] font-light items-center cursor-pointer text-zinc-200 hover:text-zinc-300/60 active:text-zinc-400/60"
          onClick={() => handleDelete()}
        >
          <AiOutlineUserDelete className="w-10 h-10" />
          <span>Delete profile</span>
        </button>
      </div>
    </div>
  );
};

export default Popover;
