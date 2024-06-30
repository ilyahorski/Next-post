import Link from "next/link";
import { signOut } from "next-auth/react";
import SubscribeToPush from "../components/pushNotification/SubscribeToPush";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { AiOutlineUserDelete } from "react-icons/ai";

const ProfileHeader = ({ name, session, data }) => {
  const handleDelete = async () => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete our account and all data?"
    );

    if (hasConfirmed) {
      try {
        const response = await fetch(`/api/users/edit/${session}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error(`Failed to delete user: ${response.status}`);
        }

        // Only redirect to home page if the deletion was successful.
        await signOut({ callbackUrl: "/" });
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <div className="w-full us:w-[80%] flex justify-between items-center">
      <div className="head_text text-start xs:-mt-4">
        <span className="text-teal-600 -ml-[4px]">
          {name === "/profile" ? "My" : name} profile
        </span>
        <p className="font-inter font-normal text-sm text-gray-500 pt-2">
          {data[0]?.creator.email}
        </p>
      </div>
      <div className="w-full us:w-[100%] flex gap-2 justify-between items-center">
        <div className="flex flex-grow justify-center gap-[8px] md:gap-[20px] w-full">
          <Link
            href={"/create-post"}
            className="flex gap-0.5 items-center flex-col cursor-pointer text-green-700/60 hover:text-green-800/60 active:text-green-900/60"
          >
            <MdOutlineLibraryAdd
              className="w-[30px] h-[30px] md:w-[40px] md:h-[40px]"
              placeholder="Open chats list"
            />
            <span
              className={
                name === "/profile"
                  ? "font-normal text-6xs text-center"
                  : "hidden"
              }
            >
              Create post
            </span>
          </Link>
          <Link
            href={`/profile/edit/?id=${session}`}
            className="flex gap-0.5 items-center flex-col cursor-pointer text-teal-700/60 hover:text-teal-800/60 active:text-teal-900/60"
          >
            <CiEdit
              className="w-[30px] h-[30px] md:w-[40px] md:h-[40px]"
              placeholder="Open chats list"
            />
            <span
              className={
                name === "/profile"
                  ? "font-normal text-6xs text-center"
                  : "hidden"
              }
            >
              Edit profile
            </span>
          </Link>

          <SubscribeToPush />

          <button
            className={
              name === "/profile"
                ? "flex gap-0.5 items-center flex-col cursor-pointer text-red-600/60 hover:text-red-700/60 active:text-red-800/60"
                : "hidden"
            }
            onClick={() => handleDelete()}
          >
            <AiOutlineUserDelete
              className="w-[30px] h-[30px] md:w-[40px] md:h-[40px]"
              placeholder="Open chats list"
            />
            <span className="font-normal text-6xs text-center">
              Delete profile
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
