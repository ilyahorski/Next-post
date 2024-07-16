"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
  scrollToBottom
}) => {
  const isMobile = useMobileCheck();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const cursorPositionRef = useRef(0);

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
    scrollToBottom();
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

  const addEmoji = useCallback((emoji) => {
    const currentMessage = message || '';
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
  }, [message, setValue, setFocus, type, messageRef]);

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