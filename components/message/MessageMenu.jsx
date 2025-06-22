import { GoReply } from "react-icons/go";
import { IoMdCopy } from "react-icons/io";
import { IoPencilOutline, IoTrashOutline } from "react-icons/io5";

import EmojiPickerComponent from "../EmojiPickerComponent";

const MessageMenu = ({ message, selectedMessage, sessionUserId, chatId, onReply, onCopyText, onEditMessage, onDeleteMessage, setSelectedMessage }) => {
    if (!selectedMessage || selectedMessage._id !== message._id) {
        return null;
    }

    return (
        <div
            style={{ touchAction: "none", bottom: 0 }}
            className={`flex flex-col items-center justify-center gap-1 w-72 absolute z-8000
                ${message?.writerId._id !== sessionUserId ? " left-[30px]" : " right-[30px]"}`}
        >
            <div className={"no-select flex flex-col w-48 gap-3 items-center justify-center rounded-md bg-zinc-900/70 backdrop-blur-sm p-2"}>
                <button style={{ touchAction: "none" }} onClick={onReply} className="no-select flex items-center justify-between gap-3 w-full">
                    <GoReply className="w-3/12 h-5 text-white" />
                    <p className="flex items-center justify-start text-[14px] w-9/12">Reply</p>
                </button>
                <button style={{ touchAction: "none" }} onClick={onCopyText} className="no-select flex items-center justify-between gap-3 w-full">
                    <IoMdCopy className="w-3/12 h-5 text-white" />
                    <p className="flex items-center justify-start text-[14px] w-9/12">Copy text</p>
                </button>
                {selectedMessage.writerId._id === sessionUserId && (
                    <button style={{ touchAction: "none" }} onClick={onEditMessage} className="no-select flex items-center justify-between gap-3 w-full">
                        <IoPencilOutline className="w-3/12 h-5 text-white" />
                        <p className="flex items-center justify-start text-[14px] w-9/12">Edit</p>
                    </button>
                )}
                <button style={{ touchAction: "none" }} onClick={onDeleteMessage} className="no-select flex items-center justify-between gap-3 w-full">
                    <IoTrashOutline className="w-3/12 h-5 text-white" />
                    <p className="flex items-center justify-start text-[14px] w-9/12">Delete</p>
                </button>
            </div>
            <div className="flex w-80 z-5000">{chatId && <EmojiPickerComponent setSelectedMessage={setSelectedMessage} messageId={message._id} userId={sessionUserId} chatId={chatId} />}</div>
        </div>
    );
};

export default MessageMenu;
