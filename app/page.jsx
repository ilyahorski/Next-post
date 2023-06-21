'use client';

import Feed from '@/components/Feed';
import { SessionProvider } from "next-auth/react";
import { ScrollToTop } from "@/components/ScrollToTop";

const Home = () => (
  <section className='w-full flex-center flex-col'>
    <h1 className='head_text text-center'>
      Open world of the
      <br className='max-md:hidden'/>
      <span className='orange_gradient text-center'> Next Post</span>
    </h1>
    <p className='desc text-center'>
      Next-Post is an open-source platform to discover, create and share creative post!
    </p>
    <SessionProvider>
      <Feed/>
      <ScrollToTop/>
    </SessionProvider>
  </section>
);

export default Home;
