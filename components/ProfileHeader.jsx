import Link from "next/link";
import {signOut} from "next-auth/react";

const ProfileHeader = ({name, session, data}) => {

  const handleDelete = async () => {
    const hasConfirmed = confirm(
      'Are you sure you want to delete our account and all data?',
    );

    if (hasConfirmed) {
      try {
        const response = await fetch(`/api/users/edit/${session}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`Failed to delete user: ${response.status}`);
        }

        // Only redirect to home page if the deletion was successful.
        await signOut({callbackUrl: '/'});

      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className='w-full us:w-[80%] flex justify-between items-center'>
      <div className='head_text text-start xs:-mt-4'>
        <span className='orange_gradient'>{name === '/profile' ? 'My' : name} profile</span>
        <p className='font-inter font-normal text-sm text-gray-500 pt-2'>{data[0]?.creator.email}</p>
      </div>
      <div className='w-full us:w-[80%] flex gap-2 justify-between items-center'>
        <button
          className={name === '/profile' ? 'flex flex-end w-full text-xl md:text-3xl font-light leading-[1.15] text-red-600' : 'hidden'}
          onClick={() => handleDelete()}
        >
          <p>
            Delete
            <br/>
            Account
          </p>
        </button>
        <div className='flex flex-col flex-grow justify-center gap-[6px] mt-[2px] md:gap-[5px] md:mb-[2px] w-full '>
          <Link
            href={'/create-post'}
            className={name === '/profile' ? 'flex justify-center w-full text-l md:text-2xl font-light leading-[1.15] text-cyan-600' : 'hidden'}
          >
            Create post
          </Link>
          <Link
            href={`/profile/edit/?id=${session}`}
            className={name === '/profile' ? 'flex justify-center w-full text-l md:text-2xl font-light leading-[1.15] text-emerald-600' : 'hidden'}
          >
            Edit profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
