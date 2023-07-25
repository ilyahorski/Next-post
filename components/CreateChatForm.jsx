'use client'

import {useEffect, useState} from 'react';
import Image from "next/image";
import {RiCloseCircleLine} from "react-icons/ri";
import {BiMessageSquareAdd} from "react-icons/bi";
import {useSession} from "next-auth/react";
import { v4 as uuidv4 } from 'uuid';

const CreateChatForm = ({ closeForm }) => {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    if (status === 'loading') return;

    const getUsers = async () => {
      const response = await fetch(`/api/users`);
      const data = await response.json();

      setUsers(data);
      setSelectedUsers(data.filter((user) =>
        user._id === session?.user?.id))
    };

    if (session) getUsers();

  }, [session]);

  const usersExceptMe = users.filter((user) =>
    user._id !== session?.user?.id
  )

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

    let chatName
    if (session?.user) {
      chatName = groupName
        ? groupName
        : (session.user.id === selectedUsers[0]._id ? selectedUsers[1].username : selectedUsers[0].username)
    }

    const chat = {
      creatorId: session?.user?.id,
      membersList: selectedUsers.map(user => user._id),
      chatName: chatName,
      lastMessage: null,
      secretToken: uuidv4()
    };

    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chat),
      });

      if (response.status === 201) {
        setGroupName('')
        setSelectedUsers(users.filter((user) =>
          user._id === session?.user?.id))

      } else {
        const errorMessage = await response.text();
        console.error('Error creating chat:', errorMessage);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <form onSubmit={submitForm} className="flex px-1 pb-3 flex-grow-1 w-full custom-height">
      <div className='flex flex-1 w-full flex-col'>
        <div className='flex gap-1 items-start'>
          <input
            type="text"
            placeholder="Create chat name"
            value={groupName}
            className='flex w-full p-2 mb-3 rounded'
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button
            className='mob:hidden flex justify-center items-center w-[40px] h-[40px]'
            type="submit"
            onClick={closeForm}
          >
            <RiCloseCircleLine className='text-primary-300 w-[40px] h-[40px]' />
          </button>
        </div>
        <div className='flex flex-col w-full border border-black rounded p-2 mb-3'>
          <h2>Selected users:</h2>
          <ul className='flex w-full flex-wrap gap-1'>
            {selectedUsers.map((user) => (
              <li
                className='flex w-auto border border-gray-500 rounded p-1'
                key={user.id}
              >
                <div className='flex gap-2 h-[30px] justify-center items-center'>
                  <Image
                    src={user.userImage ? user.userImage : user.image}
                    alt='user_image'
                    width={30}
                    height={30}
                    className='rounded-full object-fill h-[30px] w-[30px]'
                  />
                  <p className='flex h-[30px] justify-center items-center'>
                    {user.username}
                  </p>
                </div>
                <button
                  className='flex justify-center items-center w-[30px] h-[30px]'
                  type="button"
                  onClick={() => removeUser(user)}
                >
                  <RiCloseCircleLine className='text-red-600 w-[19px] h-[19px]' />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <input
          className="flex w-full p-2 mb-6 rounded"
          placeholder="Find users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className='chat-list'>
          {filteredUsers.map((user, index) => (
            <div
              key={user.id}
              className={'flex flex-row justify-between flex-wrap p-2 m-1 items-center gap-2 border-b border-primary-300'}>
              <div
                className='flex gap-2 justify-start items-center'
              >
                <Image
                  src={user.userImage ? user.userImage : user.image}
                  alt='user_image'
                  width={50}
                  height={50}
                  className='rounded-full object-fill h-[50px] w-[50px]'
                />
                <div className='flex flex-col gap-2'>
                  <p className=''>
                    {user.username}
                  </p>
                  <p className=''>
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                className='flex justify-center items-center w-[50px] h-[50px]'
                type="button"
                onClick={() => addUser(user)}
              >
                <BiMessageSquareAdd className='text-primary-300 w-[40px] h-[40px]' />
              </button>
            </div>
          ))}
        </div>

        {selectedUsers.length > 1 && (
          <button
            className='w-[200px] black_btn'
            type="submit"
          >
            Create a new chat
          </button>
        )}
      </div>
    </form>
  );
};

export default CreateChatForm;
