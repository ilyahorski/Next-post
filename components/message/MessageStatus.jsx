import {
  IoCheckmarkOutline,
  IoCheckmarkDoneOutline,
} from "react-icons/io5";

const MessageStatus = ({ message, sessionUserId }) => {
  if (message?.writerId._id !== sessionUserId) {
    return null;
  }

  switch (message?.messageStatus) {
    case "sent":
      return (
        <p className="text-white">
          <IoCheckmarkOutline />
        </p>
      );
    case "delivered":
      return (
        <p className="text-white">
          <IoCheckmarkDoneOutline />
        </p>
      );
    case "seen":
      return (
        <p className="text-teal-500">
          <IoCheckmarkDoneOutline />
        </p>
      );
    default:
      return null;
  }
};

export default MessageStatus;
