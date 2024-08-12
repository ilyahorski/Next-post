export const handleCopy = ({ post, setCopied }) => {
  const encodedUsername = encodeURIComponent(post.creator.username);
  const url = `https://next-post-two.vercel.app/post/${encodedUsername}?id=${post._id}`;
  
  setCopied(url);
  navigator.clipboard.writeText(url);
  setTimeout(() => setCopied(false), 1000);
};