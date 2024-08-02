"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { BiLogoTelegram, BiPaperclip } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { useMobileCheck } from "~/utils/hooks/useMobileCheck";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { FileUpload } from "primereact/fileupload";
import { Dialog } from "primereact/dialog";

const CommentMessageForm = ({
  type,
  onFormSubmit,
  placeholder,
  maxLength,
  messageRef,
  scrollToBottom,
}) => {
  const isMobile = useMobileCheck();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const cursorPositionRef = useRef(0);
  const fileUploadRef = useRef(null);

  const {
    register,
    reset,
    handleSubmit,
    setFocus,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const message = watch(type, "");

  const onSubmit = async (data) => {
    setShowEmojiPicker(false);
    if (selectedFiles.length > 0) {
      fileUploadRef.current.upload();
    } else {
      await sendMessage(data[type], []);
    }
  };

  const sendMessage = async (text, mediaUrls) => {
    await onFormSubmit({ [type]: text }, mediaUrls);
    reset();
    setIsSubmitted(true);
    setSelectedFiles([]);
    scrollToBottom();
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
          setFocus(type);
          input.focus();
          input.click();
          setIsSubmitted(false);
        });
      }, 50);
      return () => clearTimeout(timerId);
    }
  }, [isSubmitted, type]);

  const handleKeyDown = (event) => {
    if (!isMobile && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const handleChange = useCallback((event) => {
    cursorPositionRef.current = event.target.selectionEnd;
  }, []);

  const addEmoji = useCallback(
    (emoji) => {
      const currentMessage = message || "";
      const cursorPosition = cursorPositionRef.current;
      const newMessage =
        currentMessage.slice(0, cursorPosition) +
        emoji.native +
        currentMessage.slice(cursorPosition);

      setValue(type, newMessage);
      setFocus(type);

      if (messageRef.current) {
        const newCursorPosition = cursorPosition + emoji.native.length;
        messageRef.current.selectionStart = newCursorPosition;
        messageRef.current.selectionEnd = newCursorPosition;
        cursorPositionRef.current = newCursorPosition;
      }
    },
    [message, setValue, setFocus, type, messageRef]
  );

  return (
    <div className="flex-grow relative">
      {showEmojiPicker && (
        <div className="absolute bottom-14 right-0 z-10">
          <Picker
            data={data}
            onEmojiSelect={addEmoji}
            onClickOutside={() => setShowEmojiPicker(false)}
            title="Pick your emoji"
            emoji="point_up"
          />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-grow">
        <div className="flex w-full justify-between items-center gap-2 bg-white dark:bg-gray-600/10 rounded-lg p-1">
          <textarea
            title={`Write your ${type} here`}
            ref={messageRef}
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
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="flex items-center justify-center w-10 h-10"
                >
                  😀
                </button>
                <button
                  type="button"
                  onClick={() => setShowFileUpload(true)}
                  className="flex items-center justify-center w-10 h-10"
                >
                  <BiPaperclip className="w-6 h-6 text-primary-300" />
                </button>
              </div>
            )}
            <button
              title={`Click to send a ${type}`}
              type="submit"
              className="flex items-center justify-center w-10 h-10 cursor-pointer"
              // disabled={!message.trim() || selectedFiles.length === 0}
            >
              <BiLogoTelegram className="w-8 h-8 text-primary-300" />
            </button>
          </div>
        </div>
      </form>
      <Dialog
        visible={showFileUpload}
        onHide={() => setShowFileUpload(false)}
        header="Upload Media"
      >
        <FileUpload
          ref={fileUploadRef}
          name="media"
          url={`${process.env.NEXT_PUBLIC_SERVER_URL}/upload-media`}
          accept="image/*,video/*"
          maxFileSize={10000000}
          onUpload={onUpload}
          onSelect={onSelect}
          onClear={onClear}
          multiple
          auto={false}
        />
        {/* <div className="mt-4 flex justify-between">
          <button
            onClick={handleSubmit(onSubmit)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={selectedFiles.length === 0 && !message.trim()}
          >
            Send
          </button>
        </div> */}
      </Dialog>
    </div>
  );
};

export default CommentMessageForm;
