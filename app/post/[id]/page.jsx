"use client";

import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import ReactTimeAgoWrapper from "~/components/ReactTimeAgoWrapper";
import { Loader } from "~/components/Loading";
import { parseTags } from "~/utils/tagStringToArray";
import { HeartIcon as Heart } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { ToastContainer } from "react-toastify";
import { toggleLike } from "~/utils/toggleLike";
import Comments from "~/components/Comments";
import CommentForm from "~/components/CommentForm";
import VideoPlayer from "~/components/VideoPlayer";
import { SocketContext, SessionContext } from "~/utils/context/SocketContext";

const Post = () => {
  const searchParams = useSearchParams();
  const postIds = searchParams.get("id");
  const sessionId = useContext(SessionContext);
  const [post, setPost] = useState({
    post: "",
    tags: "",
    image: "",
    creator: "",
    createdAt: "",
  });
  const [tags, setTags] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [type, setType] = useState("");
  const [allComments, setAllComments] = useState({});

  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!sessionId) return;

    if (socket && sessionId && postIds) {
      socket.emit("checkLikeStatus", { userId: sessionId, postId: postIds });

      socket.on("likesUpdated", ({ postId, likesCount }) => {
        if (postId === postIds) {
          setLikes(likesCount);
        }
      });

      socket.on("likeStatus", ({ postId, liked }) => {
        if (postId === postIds) {
          setLiked(liked);
        }
      });

      return () => {
        socket.off("likesUpdated");
        socket.off("likeStatus");
        socket.off("connect");
      };
    }
  }, [postIds, sessionId, socket]);

  useEffect(() => {
    if (!sessionId) return;
    const getPostDetails = async () => {
      const response = await fetch(`/api/post/${postIds}`);
      const data = await response.json();

      const url = new URL(data.image);
      const pathname = url.pathname;
      const fileWithExtension = pathname.split("/").pop();
      const fileType = fileWithExtension.split("-")[0];

      setPost({
        post: data.post,
        tags: data.tag,
        image: data.image,
        creator: data.creator,
        createdAt: data.createdAt,
      });
      setTags(parseTags(data.tag));
      setType(fileType);
    };

    if (postIds) getPostDetails();
  }, [sessionId]);

  return (
    <>
      {post.post ? (
        <>
          <ToastContainer />
          <div className="flex-1 p-3 mb-4 break-inside-avoid rounded-lg border border-gray-300 bg-white/50 dark:bg-gray-950/50 bg-clip-padding backdrop-blur-lg backdrop-filter w-full h-fit -mt-8">
            <div className="flex justify-between flex-wrap p-2 mb-4 items-center gap-6 border-gray-200 border-2 rounded-lg">
              <div className="creator_info">
                <Image
                  src={
                    post.creator.userImage
                      ? post.creator.userImage
                      : post.creator.image
                  }
                  alt="user_image"
                  width={50}
                  height={50}
                  className="rounded-full object-contain"
                />

                <div className="flex flex-col">
                  <h3 className="font-satoshi font-semibold text-gray-500 dark:text-gray-300">
                    {post.creator.username}
                  </h3>
                  <p className="font-inter text-sm text-gray-500 dark:text-gray-500">
                    {post.creator.email}
                  </p>
                </div>
              </div>
              <div className="flex h-12 justify-center items-start font-inter text-sm text-gray-700 dark:text-gray-400">
                <ReactTimeAgoWrapper date={post.createdAt} />
              </div>
            </div>

            <div>
              <div className="relative flex justify-center my-4 w-full h-[450px] xs:h-[600px] rounded-lg">
                {type === "image" ? (
                  <Image
                    style={{ objectFit: "contain" }}
                    src={post.image}
                    alt="image"
                    fill={true}
                    quality={100}
                    sizes="(min-width: 66em) 100vw, (min-width: 44em) 70vw, 60vw"
                  />
                ) : (
                  <VideoPlayer full={true} preview={""} post={post} />
                )}
              </div>
              <div className="pb-1">
                <p className="my-4 pb-2 border-b-[1px] border-gray-400 font-satoshi text-[16px] text-gray-700 dark:text-gray-300">
                  {post.post}
                </p>
                <div className="flex items-start justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    {tags.map((tag, i) => (
                      <p
                        key={i}
                        className="font-inter text-sm text-cyan-500/60 cursor-pointer"
                      >
                        {tag}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-satoshi text-[16px] text-gray-700">
                      {likes}
                    </p>
                    <button
                      onClick={() =>
                        toggleLike({
                          id: postIds,
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
              </div>
              <Comments
                postId={postIds}
                isMain={false}
                comments={allComments[postIds]}
                setComments={(newComments) =>
                  setAllComments((prev) => ({
                    ...prev,
                    [postIds]: newComments,
                  }))
                }
              />
              <CommentForm postId={postIds} userId={sessionId} />
            </div>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Post;
