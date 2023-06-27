import Link from "next/link";

const ProfileHeader = ({name, session, data}) => {
  return (
    <div className='w-full us:w-[80%] flex justify-between items-center'>
      <div className='head_text text-start xs:-mt-4'>
        <span className='orange_gradient'>{name === '/profile' ? 'My' : name} profile</span>
        <p className='font-inter font-normal text-sm text-gray-500 pt-2'>{data[0]?.creator.email}</p>
      </div>
      <div className='flex flex-col justify-end gap-[10px] pb-1 xs:pb-0 xs:-mb-2 xs:gap-0 w-[65%] h-[58px]'>
        <Link
          href={'/create-post'}
          className={name === '/profile' ? 'flex gap-2 flex-end w-full text-l xs:text-2xl font-light leading-[1.15] blue_gradient' : 'hidden'}
        >
          Create post
        </Link>
        <Link
          href={`/profile/edit/?id=${session}`}
          className={name === '/profile' ? 'flex gap-2 flex-end w-full text-l xs:text-2xl font-light leading-[1.15] text-emerald-600' : 'hidden'}
        >
          Edit profile
        </Link>
      </div>
    </div>
  );
};

export default ProfileHeader;
