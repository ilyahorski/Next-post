import { useState } from "react";

import OkButton from "./OkButton";

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
            <label htmlFor="chat-name-input" className="text-[16px] font-light text-zinc-200">
                <span>Change chat name</span>
            </label>
            <div className="flex w-full gap-2">
                <input
                    id="chat-name-input"
                    className="bg-gray-800 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    type="text"
                    value={currentName}
                    onChange={handleNameChange}
                    placeholder="Enter chat name"
                />
                <OkButton onClick={handleSave} title="Save chat name" />
            </div>
        </div>
    );
};

export default ChatNameEditor;
