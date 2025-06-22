"use client";

import { useContext,useRef, useState } from "react";

import Form from "~/components/Form";
import { SessionContext } from "~/utils/context/SocketContext";
import { useInputChangeHandler } from "~/utils/hooks/useInputChangeHandler";
import { useSubmitHandler } from "~/utils/hooks/useSubmitHandler";

const CreatePost = () => {
    const [post, setPost] = useState({ post: "", tag: "", image: "" });
    const [fileData, setFileData] = useState(null);
    const handleInputChange = useInputChangeHandler(setPost);
    const cropperRef = useRef(null);
    const sessionId = useContext(SessionContext);

    const buildRequestBody = ({ post, imageUrl }) => ({
        post: post.post,
        userId: sessionId,
        tag: post.tag,
        image: imageUrl,
    });

    const { handleSubmit, isSubmitting } = useSubmitHandler(
        fileData,
        sessionId,
        post,
        cropperRef,
        setPost,
        "Failed to post data",
        "/api/post/new",
        "POST",
        "/",
        buildRequestBody
    );

    return (
        <Form
            setFileData={setFileData}
            cropperRef={cropperRef}
            type='Creat'
            post={post}
            handleInputChange={handleInputChange}
            submitting={isSubmitting}
            handleSubmit={handleSubmit}
        />
    );
};

export default CreatePost;
