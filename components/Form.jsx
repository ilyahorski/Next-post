import Link from 'next/link';
import Image from 'next/image';

const Form = ({ type, post, handleInputChange, handleFileChange, preview, submitting, handleSubmit }) => {
  return (
    <section className='w-full max-w-full flex-start flex-col'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>{type} Post</span>
      </h1>
      <p className='desc text-left max-w-md'>
        {type} and share amazing Post with the world
      </p>

      <form
        onSubmit={handleSubmit}
        className='mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism'
      >
        <label>
          <input
            type='file'
            onChange={handleFileChange}
            name='image'
          />
          {post.image && !preview && (
            <div
              className={'relative my-4 w-full h-[400px] md:h-[600px] border-gray-200 border-2 bg-amber-50 rounded-lg'}>
              <Image style={{ objectFit: 'contain' }} fill={true} alt={'preview image'}
                     src={post.image ? post.image : '/assets/icons/loader.svg'} />
            </div>
          )}
          <div
            placeholder='Select post photo'
            className={preview ? 'relative my-4 w-full h-[400px] md:h-[600px] border-gray-200 border-2 bg-amber-50 rounded-lg' : 'hidden'}>
            <Image style={{ objectFit: 'contain' }} fill={true} alt={'selected image'}
                   src={preview ? preview : '/assets/icons/loader.svg'} />
          </div>
        </label>

        <label>
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            Your Post description
          </span>

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
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            Field of Tag{' '}
            <span className='font-normal'>
              (#post, #photo, #tag, etc.)
            </span>
          </span>
          <input
            name='tag'
            value={post.tag}
            onChange={handleInputChange}
            type='text'
            placeholder='#Tag'
            pattern='#[\p{L}\p{N}_]+(\s*,\s*#[\p{L}\p{N}_]+)*\s*'
            required
            className='form_input'
          />
        </label>

        <div className='flex-end mx-3 mb-5 gap-4'>
          <Link href='/' className='text-gray-500 text-sm'>
            Cancel
          </Link>

          <button
            type='submit'
            disabled={submitting}
            className='px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white'
          >
            {submitting ? `${type}ing...` : type}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
