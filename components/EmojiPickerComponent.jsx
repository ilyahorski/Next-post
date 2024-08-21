"use client";

import { useContext, useEffect, useRef, useState } from "react";
import EmojiPicker from 'emoji-picker-react';
import { SocketContext } from "~/utils/context/SocketContext";

const EmojiPickerComponent = ({ isYour, setSelectedMessage, messageId, userId, chatId }) => {
  const socket = useContext(SocketContext);
  const pickerRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEmojiClick = (emojiObject) => {
    setSelectedMessage(null)
    if (chatId) {
      socket.emit('addReaction', { messageId, emoji: emojiObject.emoji, userId, chatId });
    }
  };

  useEffect(() => {
    const handleExpandButtonClick = (event) => {
      if (event.target.matches('button[aria-label="Show all Emojis"]')) {
        setIsExpanded(true);
      }
    };

    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('click', handleExpandButtonClick);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleExpandButtonClick);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex rounded-xl h-12 pt-1 items-center z-8000">
      <EmojiPicker
        className={`${isExpanded ? (isYour ? "-mt-[74px]" : "-mt-[10px]") : "mt-0"} absolute z-8000`}
        onEmojiClick={handleEmojiClick}
        reactionsDefaultOpen={true}
        onReactionClick={handleEmojiClick}
        theme="dark"
        emojiStyle="apple"
        width={320}
        height={250}
        previewConfig={{ showPreview: false }}
        searchDisabled={true}
        skinTonesDisabled={true}
      />
    </div>
    
  );
};

export default EmojiPickerComponent;