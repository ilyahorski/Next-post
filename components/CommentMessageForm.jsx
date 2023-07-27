'use client'

import {BiLogoTelegram} from "react-icons/bi";
import {useForm} from "react-hook-form";
import {useMobileCheck} from "~/utils/hooks/useMobileCheck";

const CommentMessageForm = ({type, onFormSubmit, placeholder, maxLength }) => {
  const isMobile = useMobileCheck();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    onFormSubmit(data);
    reset();
  };

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
          className='w-full min-h-[48px] h-[48px] pl-1 max-h-32 bg-white dark:bg-gray-600/10 outline-none rounded-lg focus:border-[1px] focus:border-primary-50'
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          rows={4}
          cols={50}
          maxLength={maxLength}
          {...register('message', {
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
    </form>
  );
};

export default CommentMessageForm;
