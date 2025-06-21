import VideoEmbed from "./VideoEmbed";

const MessageWithLinks = ({ message }) => {
  const urlPattern = /(https?:\/\/[^\s]+)/g;

  return message?.split(urlPattern).map((part, index) => {
    if (urlPattern.test(part)) {
      return <VideoEmbed key={index} url={part} />;
    }
    return part;
  });
};

export default MessageWithLinks;
