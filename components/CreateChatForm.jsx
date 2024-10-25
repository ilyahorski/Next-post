"use client";

import { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { RiCloseCircleLine } from "react-icons/ri";
import { BsExclamation } from "react-icons/bs";
import { IoAddOutline } from "react-icons/io5";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { v4 as uuidv4 } from "uuid";
import { SessionContext } from "~/utils/context/SocketContext";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "./Loading";

const fetchUsers = async () => {
  const response = await fetch(`/api/users`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const CreateChatForm = ({ closeForm }) => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const sessionId = useContext(SessionContext);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();

    const intervalId = setInterval(loadUsers, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (users && sessionId) {
      setSelectedUsers(users.filter((user) => user._id === sessionId));
    }
  }, [users, sessionId]);

  const usersExceptMe = users?.filter((user) => user._id !== sessionId) || [];

  const filteredUsers = usersExceptMe.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  const addUser = (user) => {
    if (!selectedUsers.includes(user)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const removeUser = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u !== user));
  };

  const submitForm = async (e) => {
    e.preventDefault();

    let chatName;
    if (sessionId) {
      chatName = groupName
        ? groupName
        : sessionId === selectedUsers[0]._id
        ? selectedUsers[1]?.username
        : selectedUsers[0].username;
    }

    const chat = {
      creatorId: sessionId,
      membersList: selectedUsers,
      chatName: chatName,
      chatImage: selectedUsers[0].image,
      lastMessage: null,
      secretToken: uuidv4(),
    };

    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chat),
      });

      if (response.status === 201) {
        setGroupName("");
        setSelectedUsers(users.filter((user) => user._id === sessionId));
      } else {
        const errorMessage = await response.text();
        console.error("Error creating chat:", errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading users</div>;

  return (
    <form
      onSubmit={submitForm}
      className="flex px-1 pb-3 flex-grow-1 w-full custom-height"
    >
      <div className="flex flex-1 w-full flex-col">
        <div className="flex gap-1 items-start">
          <div className="flex w-full relative">
            <input
              type="text"
              placeholder="Enter chat name"
              value={groupName}
              className="flex w-full dark:bg-gray-600/10 p-2 mb-3 rounded"
              onChange={(e) => setGroupName(e.target.value)}
            />
            <BsExclamation
              className={`${
                groupName ? "hidden" : "block"
              } absolute top-1 right-1 text-red-600 w-8 h-8`}
            />
          </div>

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
        </div>
        <div className="flex flex-col w-full border border-black rounded p-2 mb-3">
          <h2>Selected users:</h2>
          <ul className="flex w-full flex-wrap gap-1">
            {selectedUsers.map((user) => (
              <li
                className="flex w-auto border border-gray-500 rounded p-1"
                key={user._id}
              >
                <div className="flex gap-2 h-[30px] justify-center items-center">
                  <Image
                    src={user.userImage ? user.userImage : user.image}
                    alt="user_image"
                    width={30}
                    height={30}
                    className="rounded-full object-fill h-[30px] w-[30px]"
                  />
                  <p className="flex h-[30px] justify-center items-center">
                    {user.username}
                  </p>
                </div>
                {user?._id !== sessionId && (
                  <button
                    className="flex justify-center items-center w-[30px] h-[30px]"
                    type="button"
                    onClick={() => removeUser(user)}
                  >
                    <RiCloseCircleLine className="text-red-600 w-[19px] h-[19px]" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
        <input
          className="flex w-full dark:bg-gray-600/10 p-2 mb-6 rounded"
          placeholder="Find users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="chat-list">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="flex flex-row justify-between flex-wrap p-2 m-1 items-center gap-2 border-b border-primary-300"
            >
              <div className="flex gap-2 justify-start items-center">
                <Image
                  src={user.userImage ? user.userImage : user.image}
                  alt="user_image"
                  width={50}
                  height={50}
                  className="rounded-full object-fill h-12 w-12"
                />
                <div className="flex flex-col gap-2">
                  <p>{user.username}</p>
                  <p>{user.email}</p>
                </div>
              </div>
              <button
                className="flex justify-center items-center w-12 h-12"
                type="button"
                onClick={() => addUser(user)}
              >
                <IoAddOutline className="text-primary-300 w-8 h-8" />
              </button>
            </div>
          ))}
        </div>

        {selectedUsers.length >= 1 && groupName && (
          <div className="flex justify-center">
            <button className="w-[200px] black_btn" type="submit">
              Create a new chat
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default CreateChatForm;
