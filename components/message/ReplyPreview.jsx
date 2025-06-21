const ReplyPreview = ({ replyToMessage, onScrollToMessage }) => {
  if (!replyToMessage) return null;

  return (
    <div
      className="bg-zinc-900 p-2 rounded-lg cursor-pointer max-w-[300px] no-select w-full mr-8"
      onClick={() => onScrollToMessage(replyToMessage.replyTo._id)}
    >
      <p className="text-sm text-gray-100">
        Reply to {replyToMessage.replyTo?.writerId?.username}
      </p>
      <p className="text-sm truncate">
        {replyToMessage.replyTo?.message || "Media"}
      </p>
    </div>
  );
};

export default ReplyPreview;
