'use client'

import { useEffect, useState, useRef } from "react";
import {BiLogoTelegram} from "react-icons/bi";
import {useForm} from "react-hook-form";
import {useMobileCheck} from "~/utils/hooks/useMobileCheck";

const CommentMessageForm = ({type, onFormSubmit, placeholder, maxLength, messageRef }) => {
  const isMobile = useMobileCheck();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formEndRef = useRef(null);

  const {
    register,
    reset,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    onFormSubmit(data);
    reset();
    setIsSubmitted(true);
    if (isMobile && formEndRef.current) {
      formEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
    if (!isMobile && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(onSubmit)();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex-grow'>
      <div className='flex w-full justify-between items-center gap-2 bg-white dark:bg-gray-600/10 rounded-lg p-1'>
        <textarea
          title={`Write your ${type} here`}
          ref={messageRef}
          id={type}
          className='w-full min-h-[48px] h-[48px] pl-1 max-h-32 bg-white dark:bg-gray-600/10 outline-none rounded-lg focus:border-[1px] focus:border-primary-50'
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          rows={4}
          cols={50}
          maxLength={maxLength}
          {...register(type, {
            required: true,
            maxLength: maxLength,
          })}
        />
        {errors.message && (
          <p className='mt-1 text-primary-500'>
            {errors.message.type === 'maxLength' &&
              `Max length is ${maxLength} char.`}
          </p>
        )}

        <button
          title={`Click to send a ${type}`}
          type='submit'
          className='flex items-center justify-center w-10 h-10'
        >
          <BiLogoTelegram className='w-8 h-8 text-primary-300'/>
        </button>
      </div>
      <div ref={formEndRef} />
    </form>
  );
};

export default CommentMessageForm;
