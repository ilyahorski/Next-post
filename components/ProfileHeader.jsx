import { useState, useRef } from "react";
import { signOut } from "next-auth/react";
import Popover from "./Popover";

const ProfileHeader = ({ name, session, data }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleDelete = async () => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete your account and all data?"
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
      <div className="w-full us:w-[100%] flex gap-2 justify-end items-end">
        <button
          className="flex items-center justify-center text-[18px] md:text-[26px] px-3 md:pb-1 font-light bg-gray-800 rounded-md text-zinc-200"
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        >
          Settings
        </button>
        {isPopoverOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-[1000]"
          >
            <Popover
              handleDelete={handleDelete}
              session={session}
              setIsPopoverOpen={setIsPopoverOpen}
              onClose={() => setIsPopoverOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
