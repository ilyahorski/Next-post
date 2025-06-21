import { useState } from "react";

const ChatNameEditor = ({ chatName, onNameUpdate }) => {
  const [currentName, setCurrentName] = useState(chatName);

  const handleNameChange = (event) => {
    setCurrentName(event.target.value);
  };

  const handleSave = () => {
    onNameUpdate(currentName);
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <label className="text-[16px] font-light text-zinc-200">
        Change chat name
      </label>
      <div className="flex w-full gap-2">
        <input
          className="bg-gray-800 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          type="text"
          value={currentName}
          onChange={handleNameChange}
          placeholder="Enter chat name"
        />
        <button
          className="w-[50px] p-2.5 items-center justify-center bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleSave}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ChatNameEditor;
