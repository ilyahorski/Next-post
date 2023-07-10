'use client';

import Feed from '~/components/Feed';
import {SessionProvider, useSession} from "next-auth/react";
import { ScrollToTop } from "~/components/ScrollToTop";
import {ToastContainer} from "react-toastify";
import Link from "next/link";

const Home = () => {
  const {data: session, status} = useSession();

  return (
    <section className='w-full flex-center flex-col'>
      <div className='head_text text-center'>
        Open world of the
        <br className='md:hidden'/>
        <span className='blue_gradient text-center'> Next Post</span>
      </div>
      <p className='desc text-center'>
        Next-Post is an open-source platform to discover, create and share creative post!
      </p>
      <SessionProvider>
        <div className='flex xs:hidden w-full justify-center mt-3 -mb-6'>
          <Link href='/create-post' className={(status === 'authenticated') ? 'black_btn' : 'hidden'}>
            Create Post Here!
          </Link>
        </div>
        <Feed/>
        <ScrollToTop/>
        <ToastContainer/>
      </SessionProvider>
    </section>
  );
};

export default Home;
