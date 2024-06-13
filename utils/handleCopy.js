export const handleCopy = ({ post, setCopied }) => {
  setCopied(`https://next-post-two.vercel.app/post/${post.creator.username}?id=${post._id}`);
  navigator.clipboard.writeText(`https://next-post-two.vercel.app/post/${post.creator.username}?id=${post._id}`);
  setTimeout(() => setCopied(false), 1000);
};