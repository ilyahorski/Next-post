'use client';

import Feed from '@/components/Feed';
import { SessionProvider } from "next-auth/react";
import { ScrollToTop } from "@/components/ScrollToTop";
import {ToastContainer} from "react-toastify";
import Link from "next/link";

const Home = () => (
  <section className='w-full flex-center flex-col'>
    <div className='head_text text-center'>
      Open world of the
      <br className='md:hidden'/>
      <span className='orange_gradient text-center'> Next Post</span>
    </div>
    <p className='desc text-center'>
      Next-Post is an open-source platform to discover, create and share creative post!
    </p>
    <div className='flex xs:hidden w-full justify-center mt-3 -mb-6'>
      <Link href='/create-post' className='black_btn'>
        Create Post Here!
      </Link>
    </div>
    <SessionProvider>
      <Feed/>
      <ScrollToTop/>
      <ToastContainer />
    </SessionProvider>
  </section>
);

export default Home;
