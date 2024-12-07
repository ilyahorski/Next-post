"use client";

import { useEffect, useState, useRef, useCallback, useContext } from "react";
import { BiLogoTelegram, BiPaperclip } from "react-icons/bi";
import { AiOutlineFileAdd } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { useMobileCheck } from "~/utils/hooks/useMobileCheck";
import { IoIosClose } from "react-icons/io";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import CustomFileUpload from "./CustomFileUpload";
import { MessageContext } from "~/utils/context/SocketContext";
import AudioRecorder from "./AudioRecorder";
import VideoRecorder from "./VideoRecorder";

const CommentMessageForm = ({
  type,
  onFormSubmit,
  placeholder,
  maxLength,
  messageRef,
  formEndRef,
  replyTo,
  setReplyTo,
  initialValue,
}) => {
  const isMobile = useMobileCheck();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showMediaButtons, setShowMediaButtons] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState("");
  const { editingMessage, setEditingMessage } = useContext(MessageContext);
  const cursorPositionRef = useRef(0);
  const fileUploadRef = useRef(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    setFocus,
    setValue,
    formState: { errors },
  } = useForm();

  const resetForm = useCallback(() => {
    setMessage("");
    reset((value) => ({ ...value, message: "" }));
    if (messageRef?.current) {
      messageRef.current.value = "";
    }
  }, [reset, messageRef]);

  const onSubmit = async (data) => {
    setShowEmojiPicker(false);
    if (selectedFiles.length > 0) {
      fileUploadRef?.current?.upload();
    } else {
      await sendMessage(message, []);
    }
    setIsSubmitted(true);
  };

  const sendMessage = async (text, mediaUrls) => {
    await onFormSubmit({ [type]: text }, mediaUrls);
    resetForm();
    setSelectedFiles([]);
    setShowFileUpload(false);
  };

  const onUpload = async (event) => {
    const mediaUrls = event.xhr.response
      ? JSON.parse(event.xhr.response).mediaUrls
      : [];

    await sendMessage(message, mediaUrls);
  };

  const onSelect = (event) => {
    setSelectedFiles(event.files);
  };

  const onClear = () => {
    setSelectedFiles([]);
  };

  useEffect(() => {
    if (isSubmitted) {
      const timerId = setTimeout(() => {
        requestAnimationFrame(() => {
          const input = document.getElementById(type);
          // setFocus(type);
          input.focus();
          input.click();
          setIsSubmitted(false);
        });
      }, 300);
      return () => clearTimeout(timerId);
    }
  }, [isSubmitted, type, setFocus]);

  useEffect(() => {
    if (editingMessage) {
      setValue(type, editingMessage.message);
      setMessage(editingMessage.message);
      const length = editingMessage.message.length;
      if (messageRef?.current) {
        messageRef.current.setSelectionRange(length, length);
      }
      setFocus(type);
    } else {
      resetForm();
    }
  }, [editingMessage, setValue, setFocus, type, messageRef]);

  const handleKeyDown = (event) => {
    if (!isMobile && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const handleChange = useCallback((event) => {
    cursorPositionRef.current = event.target.selectionEnd;
    setMessage(event.target.value);
  }, []);

  const addEmoji = useCallback(
    (emoji) => {
      const cursorPosition = cursorPositionRef.current;
      const newMessage =
        message.slice(0, cursorPosition) +
        emoji.native +
        message.slice(cursorPosition);

      setMessage(newMessage);
      setValue(type, newMessage);
      setFocus(type);

      if (messageRef?.current) {
        const newCursorPosition = cursorPosition + emoji.native.length;
        messageRef.current.selectionStart = newCursorPosition;
        messageRef.current.selectionEnd = newCursorPosition;
        cursorPositionRef.current = newCursorPosition;
      }
    },
    [message, setValue, setFocus, type, messageRef]
  );

  const handleAudioRecordStart = () => {
    setIsRecordingAudio(true);
  };

  const handleAudioRecordStop = async (audioBlob) => {
    setIsRecordingAudio(false);
    await handleMediaUpload(audioBlob, "audio");
  };

  const handleVideoRecordStart = () => {
    setIsRecordingVideo(true);
  };

  const handleVideoRecordStop = async (videoBlob) => {
    setIsRecordingVideo(false);
    await handleMediaUpload(videoBlob, "video");
  };

  const handleMediaUpload = async (mediaBlob, mediaType) => {
    const file = new File(
      [mediaBlob],
      `device_record_${Date.now()}.${mediaType === "audio" ? "webm" : "mp4"}`,
      { type: mediaType === "audio" ? "audio/webm" : "video/mp4" }
    );
    const formData = new FormData();
    formData.append("media", file);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/upload-media`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const { mediaUrls } = await response.json();
        await sendMessage(message, mediaUrls);
      } else {
        console.error("Error uploading media");
      }
    } catch (error) {
      console.error("Error uploading media:", error);
    }
  };

  return (
    <div id="messagesContainer" className="flex-grow relative">
      {replyTo && (
        <div className="flex flex-1 justify-between items-center absolute top-0 -mt-10 rounded-t-md w-full text-sm bg-zinc-950 z-5000 text-gray-300 pl-3">
          <div className="flex flex-col max-w-[300px]">
            <p className="truncate">Replying to: {replyTo.writerId.username}</p>
            <p className="truncate">{replyTo.message || "Media"}</p>
          </div>
          <button
            className="flex p-2 text-red-600"
            onClick={() => setReplyTo(null)}
          >
            <IoIosClose className="w-5 h-5" />
          </button>
        </div>
      )}
      {editingMessage && (
        <div className="flex flex-1 justify-between items-center absolute top-0 -mt-8 rounded-t-md w-full text-sm bg-zinc-950 z-5000 text-gray-300 pl-3">
          <div className="flex flex-col max-w-[300px]">
            <p className="truncate">
              {"Edit: " + editingMessage.message || "Write a new message"}
            </p>
          </div>
          <button
            className="flex p-2 text-red-600"
            onClick={() => setEditingMessage(null)}
          >
            <IoIosClose className="w-5 h-5" />
          </button>
        </div>
      )}
      {showEmojiPicker && (
        <div className="absolute bottom-14 right-0 z-10">
          <Picker
            data={data}
            onEmojiSelect={addEmoji}
            categories={[
              "frequent",
              "people",
              "nature",
              "food",
              "activity",
              "places",
              "objects",
              "symbols",
              "flags",
            ]}
            onClickOutside={() => setShowEmojiPicker(false)}
            previewPosition="none"
            title=""
            emoji="point_up"
          />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-grow">
        <div className="flex w-full justify-between items-center gap-2 bg-white dark:bg-gray-600/10 rounded-lg p-1">
          <textarea
            title={`Write your ${type} here`}
            ref={messageRef}
            defaultValue={initialValue}
            id={type}
            className="w-full min-h-[48px] h-[48px] pl-1 max-h-32 bg-white dark:bg-gray-600/10 outline-none rounded-lg focus:border-[1px] focus:border-primary-50"
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            onClick={handleChange}
            onSelect={handleChange}
            rows={4}
            cols={50}
            maxLength={maxLength}
            {...register(type, {
              required: false,
              maxLength: maxLength,
            })}
          />
          {errors.message && (
            <p className="mt-1 text-primary-500">
              {errors.message.type === "maxLength" &&
                `Max length is ${maxLength} char.`}
            </p>
          )}

          <div className="flex items-center gap-1">
            {type === "message" && (
              <div className="relative flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="flex items-center justify-center w-10 h-10"
                >
                  😀
                </button>
                <button
                  type="button"
                  onClick={() => setShowMediaButtons(!showMediaButtons)}
                  className="flex items-center justify-center w-10 h-10"
                >
                  <AiOutlineFileAdd className="w-6 h-6 text-primary-300" />
                </button>
                {showMediaButtons && (
                  <div className="absolute bottom-12 -right-[47px] flex gap-1 bg-white dark:bg-gray-800 p-1 rounded-lg shadow-lg z-5000">
                    <button
                      type="button"
                      onClick={() => setShowFileUpload(true)}
                      className="flex items-center justify-center w-10 h-10"
                    >
                      <BiPaperclip className="w-6 h-6 text-primary-300" />
                    </button>
                    <AudioRecorder
                      onRecordingStart={handleAudioRecordStart}
                      onRecordingStop={handleAudioRecordStop}
                      showMediaButtons={showMediaButtons}
                      setShowMediaButtons={setShowMediaButtons}
                    />
                    <VideoRecorder
                      onRecordingStart={handleVideoRecordStart}
                      onRecordingStop={handleVideoRecordStop}
                      showMediaButtons={showMediaButtons}
                      setShowMediaButtons={setShowMediaButtons}
                    />
                  </div>
                )}
              </div>
            )}
            <button
              title={`Click to send a ${type}`}
              type="submit"
              className="flex items-center justify-center w-10 h-10 cursor-pointer"
              disabled={
                !message.trim() &&
                selectedFiles.length === 0 &&
                !isRecordingAudio &&
                !isRecordingVideo
              }
            >
              <BiLogoTelegram className="w-8 h-8 text-primary-300" />
            </button>
          </div>
        </div>
      </form>
      {showFileUpload && (
        <CustomFileUpload
          showFileUpload={showFileUpload}
          setShowFileUpload={setShowFileUpload}
          fileUploadRef={fileUploadRef}
          messageRef={messageRef}
          onUpload={onUpload}
          onSelect={onSelect}
          onClear={onClear}
          handleChange={handleChange}
          register={register}
          errors={errors}
          resetForm={resetForm}
        />
      )}
      <div ref={formEndRef} />
    </div>
  );
};

export default CommentMessageForm;
