import { useState } from "react";

import useClickOutside from "~/utils/hooks/useClickOutside";

import {
    BackgroundSelector,
    ChatImageEditor,
    ChatNameEditor,
    DeleteChatButton,
} from "./settings";

const SettingsPopover = ({
    popoverRef,
    onClose,
    chat,
    background,
    setBackground,
    setChat,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    useClickOutside(popoverRef, onClose);

    const handleChatUpdate = async (updateData) => {
        setIsLoading(true);

        try {
            const response = await fetch(`/api/chats/${chat._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                const updatedChat = await response.json();

                if (setChat) {
                    setChat(updatedChat);
                }

                onClose();
            } else {
                throw new Error("Error updating chat");
            }
        } catch (error) {
            console.error("Error updating chat:", error);
            alert("Failed to update chat. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpdate = (newImage) => {
        handleChatUpdate({
            chatName: chat.chatName,
            chatImage: newImage,
        });
    };

    const handleNameUpdate = (newName) => {
        handleChatUpdate({
            chatName: newName,
            chatImage: chat.chatImage,
        });
    };

    const handleBackgroundUpdate = (newBackground) => {
        const storageKey = `chat-background-${chat._id}`;
        
        localStorage.setItem(storageKey, newBackground);
        setBackground(newBackground);
        onClose();
    };

    const handleTemporaryBackgroundChange = (newBackground) => {
        setBackground(newBackground);
    };

    return (
        <div
            ref={popoverRef}
            className="bg-zinc-800/20 backdrop-blur-md h-fit p-4 rounded-lg shadow-lg max-w-1/2 relative overflow-y-auto"
        >
            {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="text-white">Updating...</div>
                </div>
            )}

            <div className="flex flex-col items-start gap-4 mt-8">
                <ChatImageEditor
                    chatImage={chat?.chatImage}
                    onImageUpdate={handleImageUpdate}
                />

                <ChatNameEditor
                    chatName={chat?.chatName}
                    onNameUpdate={handleNameUpdate}
                />

                <BackgroundSelector
                    background={background}
                    onBackgroundUpdate={handleBackgroundUpdate}
                    onTemporaryBackgroundChange={handleTemporaryBackgroundChange}
                />

                <DeleteChatButton chatId={chat._id} />
            </div>
        </div>
    );
};

export default SettingsPopover;
