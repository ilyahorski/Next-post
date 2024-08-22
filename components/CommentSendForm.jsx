"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BiLogoTelegram } from "react-icons/bi";

const CommentSendForm = ({ onFormSubmit, placeholder, maxLength }) => {
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const commentValue = watch("comment");

  useEffect(() => {
    setMessage(commentValue || "");
  }, [commentValue]);

  const onSubmit = async (data) => {
    await onFormSubmit({ comment: data.comment });
    reset();
    setMessage("");
  };

  const handleChange = (event) => {
    const newValue = event.target.value;
    setMessage(newValue);
    setValue("comment", newValue);
  };


  return (
    <div className="flex-grow relative">
      <form onSubmit={handleSubmit(onSubmit)} className="flex-grow">
        <div className="flex w-full justify-between items-center gap-2 bg-white dark:bg-gray-600/10 rounded-lg p-1">
          <textarea
            id="comment"
            className="w-full min-h-[48px] h-[48px] pl-1 max-h-32 bg-white dark:bg-gray-600/10 outline-none rounded-lg focus:border-[1px] focus:border-primary-50"
            placeholder={placeholder}
            onChange={handleChange}
            rows={4}
            cols={50}
            maxLength={maxLength}
            {...register("comment", {
              required: false,
              maxLength: maxLength,
            })}
          />
          {errors.comment && (
            <p className="mt-1 text-primary-500">
              {errors.comment.type === "maxLength" &&
                `Max length is ${maxLength} char.`}
            </p>
          )}
          <button
            type="submit"
            className="flex items-center justify-center w-10 h-10 cursor-pointer"
            disabled={!message.trim()}
          >
            <BiLogoTelegram className="w-8 h-8 text-primary-300" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSendForm;