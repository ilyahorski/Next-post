"use client";

import { useEffect, useState, useRef } from "react";
import { BiLogoTelegram } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { useMobileCheck } from "~/utils/hooks/useMobileCheck";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const CommentMessageForm = ({
  type,
  onFormSubmit,
  placeholder,
  maxLength,
  messageRef,
  formEndRef,
}) => {
  const isMobile = useMobileCheck();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

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

  const onSubmit = (data) => {
    setShowEmojiPicker(false);
    onFormSubmit(data);
    reset();
    setIsSubmitted(true);
    if (isMobile && formEndRef.current) {
      formEndRef.current.scrollIntoView({
        behavior: "instant",
        block: "end",
        inline: "end",
      });
    }
  };

  useEffect(() => {
    if (isSubmitted) {
      setTimeout(() => {
        document.getElementById(type).focus();
        setIsSubmitted(false);
      }, 50);
    }
  }, [isSubmitted, type]);

  const handleKeyDown = (event) => {
    if (!isMobile && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const handleChange = (event) => {
    setCursorPosition(event.target.selectionEnd);
  };

  const addEmoji = (emoji) => {
    const text =
      message.slice(0, cursorPosition) +
      emoji.native +
      message.slice(cursorPosition);
    setValue(type, text);
    setFocus(type);
    setTimeout(() => {
      if (messageRef.current) {
        messageRef.current.selectionStart = cursorPosition + emoji.native.length;
        messageRef.current.selectionEnd = cursorPosition + emoji.native.length;
      }
    }, 0);
  };

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
            rows={4}
            cols={50}
            maxLength={maxLength}
            {...register(type, {
              required: true,
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
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex items-center justify-center w-10 h-10"
              >
                😀
              </button>
            )}
            <button
              title={`Click to send a ${type}`}
              type="submit"
              className="flex items-center justify-center w-10 h-10"
            >
              <BiLogoTelegram className="w-8 h-8 text-primary-300" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommentMessageForm;
