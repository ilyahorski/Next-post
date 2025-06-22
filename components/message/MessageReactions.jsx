const MessageReactions = ({ message, sessionUserId, onReactionClick }) => {
    if (!message.reactions || message.reactions.length === 0) {
        return null;
    }

    return (
        <div className="flex min-w-[50px] -mb-2 gap-1">
            {message.reactions.map((reaction) => (
                <button
                    key={reaction.emoji}
                    onClick={() => onReactionClick(message, reaction.emoji)}
                    className={`flex items-center bg-transparent px-1 py-1 text-xs ${reaction.users.includes(sessionUserId) ? "bg-blue-500" : ""}`}
                >
                    <span className="text-[14px] mr-1">{reaction.emoji}</span>
                    <span className="text-[14px]">{reaction.users.length}</span>
                </button>
            ))}
        </div>
    );
};

export default MessageReactions;
