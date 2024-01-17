'use client'

import Link from 'next/link';
import ImageEditor from "~/components/ImageEditor";


const Form = (
  {
    setFileData,
    cropperRef,
    type,
    post,
    handleInputChange,
    submitting,
    handleSubmit
  }) => {

  let dataType
  if (post?.image) {
    const url = new URL(post?.image);
    const pathname = url.pathname;
    const fileWithExtension = pathname.split("/").pop();
    dataType = fileWithExtension.split("-")[0];
  }

  return (
    <section className='w-full max-w-full flex-start flex-col'>
      <h2 className='head_text text-center -mt-10'>
        <span className='blue_gradient'>{type}e Post</span>
      </h2>

      <form
        onSubmit={handleSubmit}
        className='p-4 gap-5 glassmorphism mt-8 w-full flex flex-col xs:flex-row'
      >
        <ImageEditor setFileData={setFileData} dataType={dataType} googleDataType={null} post={post} cropperRef={cropperRef}/>

        <div className='xs:w-[50%] w-full'>
          <label>
            <div className='flex w-full h-[56px] items-center justify-start font-satoshi font-semibold text-2xl text-gray-700 dark:text-gray-300'>
              Post description
            </div>

            <textarea
              name='post'
              value={post.post}
              onChange={handleInputChange}
              placeholder='Write your post here'
              required
              className='form_textarea'

            />
          </label>

          <label>
          <div className='mt-2 font-satoshi font-semibold text-base text-gray-700 dark:text-gray-300'>
            Field of Tag{' '}
            <span className='font-normal'>
              (Post, Photo, tag, etc...)
            </span>
          </div>
            <input
              name='tag'
              value={post.tag}
              onChange={handleInputChange}
              type='text'
              placeholder='Your tag here'
              pattern='[\p{L}\p{N}_]+(\s*,\s*[\p{L}\p{N}_]+)*\s*'
              required
              className='form_input'
            />
          </label>

          <div className='flex-end mt-2 mx-3 mb-5 gap-4'>
            <Link href='/profile' className='text-gray-500 dark:text-gray-300 text-sm'>
              Cancel
            </Link>

            <button
              type='submit'
              disabled={submitting}
              className='px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white'
            >
              {submitting ? `${type}ing...` : `${type}e`}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Form;
