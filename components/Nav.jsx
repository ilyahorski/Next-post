'use client';

import Link from 'next/link';
import Image from 'next/image';
import {useEffect, useRef, useState} from 'react';
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';
import DarkModeToggle from "~/components/ThemeModeToggle";
import useClickOutside from "~/utils/hooks/useClickOutside";

const Nav = () => {
  const { data: session, status } = useSession();
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [providers, setProviders] = useState(null);
  const [data, setData] = useState({ username: '', userImage: '', image: ''});
  const ref = useRef(null);
  useClickOutside(ref, () => setToggleDropdown(false));

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, [session]);

  useEffect(() => {
    const getUserData = async () => {
      const response = await fetch(`/api/users/edit/${session?.user.id}`);
      const data = await response.json();

      setData({
        username: data.username,
        userImage: data.userImage,
        image: data.image,
      });
    };

    if (session) getUserData();
  }, [session]);

  return (
    <nav className='flex-between w-full mb-16 pt-3'>
      <Link href='/' className='flex gap-2 flex-center'>
        <Image
          src='/assets/images/logo.png'
          alt='logo'
          width={190}
          height={90}
          quality={100}
          className='object-contain'
        />
      </Link>

      {/* Desktop Navigation */}
      <div className='xs:flex hidden'>
        {session?.user ? (
          <div className='flex items-center gap-3 md:gap-5'>
            <DarkModeToggle />

            <Link href='/create-post' className='black_btn'>
              Create Post
            </Link>

            <button
              type='button'
              onClick={(e) => {
                e.preventDefault();
                signOut({ callbackUrl: '/' });
              }}
              className='outline_btn'
            >
              Sign Out
            </button>

            <Link
              title='Click to open your profile page'
              href='/profile'
            >
              <Image
                src={data?.userImage ? data?.userImage : session?.user.image}
                width={40}
                height={40}
                className='rounded-full'
                alt='profile'
              />
            </Link>
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type='button'
                  key={provider.name}
                  onClick={(e) => {
                    e.preventDefault()
                    signIn(provider.id);
                  }}
                  className='black_btn'
                >
                  Sign in with {provider.name}
                </button>
              ))}
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div ref={ref} className='xs:hidden flex relative'>
        {session?.user ? (
          <div className='flex items-center gap-5'>
            <DarkModeToggle />

            <Image
              src={data?.userImage ? data?.userImage : session?.user.image}
              width={37}
              height={37}
              className='rounded-full'
              alt='profile'
              onClick={() => setToggleDropdown(!toggleDropdown)}
            />

            {toggleDropdown && (
              <div className='dropdown z-50'>
                <Link
                  href='/profile'
                  className='dropdown_link_profile'
                  onClick={() => setToggleDropdown(false)}
                >
                  My Profile
                </Link>
                <Link
                  href='/create-post'
                  className='dropdown_link_post'
                  onClick={() => setToggleDropdown(false)}
                >
                  Create Post
                </Link>
                <button
                  type='button'
                  onClick={(e) => {
                    e.preventDefault()
                    setToggleDropdown(false);
                    signOut('google', { callbackUrl: '/' });
                  }}
                  className='mt-5 w-full outline_btn'
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {providers &&
              Object.values(providers).map((provider) => (
                <button
                  type='button'
                  key={provider.name}
                  onClick={(e) => {
                    e.preventDefault()
                    signIn(provider.id);
                  }}
                  className='black_btn'
                >
                  Sign in
                </button>
              ))}
          </>
        )}
      </div>
    </nav>
  );
};

export default Nav;
