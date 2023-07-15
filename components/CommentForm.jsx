'use client'

import {BiLogoTelegram} from "react-icons/bi";
import {useForm} from "react-hook-form";
import {io} from "socket.io-client";


const CommentForm = ({ userId, postId }) => {

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const commentData = {
      commentatorId: userId,
      postId: postId,
      comment: data.message
    };

    const socket = io('https://next-post-bc80bba88d82.herokuapp.com/');

    socket.emit('sendComment', commentData);

    socket.on('commentSent', (response) => {
      if (response.status === 'success') {
        console.log('Comment sent successfully');
        reset();
      } else {
        console.log('Error sending comment: ', response.message);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='flex w-full justify-between items-center gap-2 bg-white rounded-lg p-1'>
          <textarea
            className='w-full min-h-[48px] h-[48px] pl-1 max-h-32 focus:outline-none focus:rounded-lg focus:border-[1px] focus:border-primary-50'
            placeholder={'Comment message'}
            rows={4}
            cols={50}
            maxLength={200}
            {...register('message', {
              required: true,
              maxLength: 2000,
            })}
          />
        {errors.message && (
          <p className='mt-1 text-primary-500'>
            {errors.message.type === 'maxLength' &&
              'Max length is 2000 char.'}
          </p>
        )}

        <button
          type='submit'
          className='flex items-center justify-center w-10 h-10'
        >
          <BiLogoTelegram className='w-10 h-10 text-primary-300'/>
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
