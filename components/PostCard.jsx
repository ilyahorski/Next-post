"use client";

import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { parseTags } from "~/utils/tagStringToArray";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as Heart } from "@heroicons/react/24/solid";
import Sceleton from "~/components/Sceleton";
import { toggleLike } from "~/utils/toggleLike";
import ReactTimeAgo from "react-time-ago";
import {
  localeToFullLocale,
  supportedLocales,
} from "~/utils/constants/supportedLocales";
import JavascriptTimeAgo from "javascript-time-ago";
import { handleCopy } from "~/utils/handleCopy";
import Comments from "~/components/Comments";
import CommentForm from "~/components/CommentForm";
import VideoPlayer from "~/components/VideoPlayer";
import { SocketContext, SessionContext } from "~/utils/context/SocketContext";

JavascriptTimeAgo.addLocale(supportedLocales.en);

const PostCard = ({
  columnView,
  post,
  myPosts,
  setMyPosts,
  handleTagClick,
  comments,
  setComments,
}) => {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState("");
  const [localeLoaded, setLocaleLoaded] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const pathName = usePathname();
  const router = useRouter();
  const locale = navigator.language;
  const tags = parseTags(post.tag);
  const JSImage = window.Image;
  const postCardStyle =
    "flex-1 h-fit break-inside-avoid rounded-lg dark:border-0 bg-white/20 dark:bg-zinc-800/80 bg-clip-padding p-6 pb-4 backdrop-blur-lg backdrop-filter";

  const url = new URL(post.image);
  const pathname = url.pathname;
  const fileWithExtension = pathname.split("/").pop();
  const type = fileWithExtension.split("-")[0];

  const socket = useContext(SocketContext);
  const sessionId = useContext(SessionContext);

  useEffect(() => {
    const img = new JSImage();

    img.onload = function () {
      setDimensions({ width: this.width, height: this.height });
    };

    img.src = post.image;
  }, [post.image]);

  useEffect(() => {
    if (!sessionId || !socket) return;

    if (socket && sessionId && post?._id) {
      socket.emit("checkLikeStatus", { userId: sessionId, postId: post?._id });

      socket.on("likesUpdated", ({ postId, likesCount }) => {
        if (postId === post?._id) {
          setLikes(likesCount);
        }
      });

      socket.on("likeStatus", ({ postId, liked }) => {
        if (postId === post?._id) {
          setLiked(liked);
        }
      });

      return () => {
        socket.off("likesUpdated");
        socket.off("likeStatus");
      };
    }
  }, [post._id, sessionId, socket]);

  useEffect(() => {
    const userLocale = navigator.language.split("-")[0];
    setLocaleLoaded(true);
    if (userLocale in supportedLocales) {
      JavascriptTimeAgo.addLocale(supportedLocales[userLocale]);
    }
  }, []);

  const handleProfileClick = () => {
    if (post.creator._id === sessionId) return router.push("/profile");

    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
  };

  const handlePostOpen = (post) => {
    router.push(`/post/${post.creator.username}?id=${post._id}`);
  };

  const handleEdit = () => {
    router.push(`/update-post?id=${post._id}`);
  };

  const handleDelete = async () => {
    const hasConfirmed = confirm("Are you sure you want to delete this post?");

    if (hasConfirmed) {
      try {
        await fetch(`/api/post/${post._id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = myPosts.filter((item) => item._id !== post._id);

        setMyPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      {post && localeLoaded ? (
        <div
          className={`${postCardStyle} ${
            columnView ? " sm:w-[510px] w-[370px]" : "sm:w-[510px] w-[370px]"
          }`}
        >
          <div className="flex justify-between items-end gap-5 -mt-3">
            <div
              title="Click to open creator profile"
              className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
              onClick={handleProfileClick}
            >
              <Image
                src={
                  post.creator.userImage
                    ? post.creator.userImage
                    : post.creator.image
                }
                alt="user_image"
                width={50}
                height={50}
                quality={100}
                className="rounded-full object-contain"
              />

              <div className="flex flex-col gap-2">
                <h3 className="font-satoshi font-semibold text-gray-900 dark:text-gray-400">
                  {post.creator.username}
                </h3>
                <p className="font-inter text-sm text-gray-500 dark:text-gray-300">
                  {post.creator.email}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-[6px]">
              <div className="flex overflow-auto justify-center items-center font-inter text-sm text-gray-500">
                <ReactTimeAgo
                  date={new Date(post.createdAt).getTime()}
                  locale={
                    locale in supportedLocales
                      ? localeToFullLocale[locale]
                      : "en-GB"
                  }
                  timeStyle="round"
                />
              </div>
              <button
                title="Click to copy post link"
                className="copy_btn"
                onClick={() => handleCopy({ post: post, setCopied: setCopied })}
              >
                <Image
                  src={
                    copied ? "/assets/icons/tick.svg" : "/assets/icons/copy.svg"
                  }
                  alt={copied ? "tick_icon" : "copy_icon"}
                  width={12}
                  height={12}
                />
              </button>
            </div>
          </div>

          <div>
            <div
              title={type === "image" ? "Click to open a post page" : null}
              onClick={() => {
                if (type === "image") {
                  handlePostOpen(post);
                }
              }}
              className="relative flex justify-center my-4 w-full h-fit"
            >
              {type === "image" ? (
                <div className="relative flex justify-center my-4 w-full ">
                  <Image
                    style={{ objectFit: "contain", cursor: "pointer" }}
                    src={post.image}
                    alt="image"
                    width={dimensions.width}
                    height={dimensions.height}
                    // fill={true}
                    quality={100}
                    // loading="eager"
                    sizes="(min-width: 66em) 100vw, (min-width: 44em) 70vw, 60vw"
                  />
                </div>
              ) : (
                <VideoPlayer full={false} preview={""} post={post} />
              )}
            </div>
            <p
              title={type === "image" ? "Click to open a post page" : null}
              onClick={() => handlePostOpen(post)}
              className="my-4 pb-2 border-b-[1px] border-gray-400 dark:text-gray-300 font-satoshi text-sm text-gray-700 cursor-pointer"
            >
              {post.post}
            </p>
            <div className="flex items-start justify-between pb-1">
              <div className="flex flex-wrap items-center gap-2">
                {tags.map((tag, i) => (
                  <p
                    key={i}
                    title={`Click to find all ${tag} posts`}
                    className="font-inter text-sm text-cyan-600 cursor-pointer"
                    onClick={() => handleTagClick && handleTagClick(tag)}
                  >
                    {tag}
                  </p>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <p className="font-satoshi text-[16px] text-gray-700 dark:text-gray-400">
                  {likes}
                </p>
                <button
                  onClick={() =>
                    toggleLike({
                      id: post._id,
                      session: sessionId,
                      setLikes: setLikes,
                      setLiked: setLiked,
                    })
                  }
                >
                  {liked ? (
                    <Heart className="h-6 w-6 text-red-500 " />
                  ) : (
                    <HeartIcon className="h-6 w-6 " />
                  )}
                </button>
              </div>
            </div>
            <div
              title="Click to open a comments"
              className="cursor-pointer"
              onClick={() => handlePostOpen(post)}
            >
              <Comments
                postId={post?._id}
                isMain={true}
                comments={comments}
                setComments={setComments}
              />
            </div>
            <CommentForm postId={post?._id} userId={sessionId} />
          </div>

          {sessionId === post.creator._id && /^\/profile/.test(pathName) && (
            <div className="mt-5 flex-center gap-4 pt-3">
              <button
                className="font-inter text-sm green_gradient cursor-pointer"
                onClick={() => handleEdit()}
              >
                Edit
              </button>
              <button
                className="font-inter text-sm red_gradient cursor-pointer"
                onClick={() => handleDelete()}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ) : (
        <Sceleton />
      )}
    </>
  );
};

export default PostCard;
