'use client';

import Feed from '~/components/Feed';
import Provider from "~/app/provider";
import { useSession } from "next-auth/react";
import { ScrollToTop } from "~/components/ScrollToTop";
import {ToastContainer} from "react-toastify";
import Link from "next/link";
import useServiceWorker from '~/utils/hooks/useServiceWorker';

const Home = () => {
  useServiceWorker();
  const {data: session, status} = useSession();

  return (
    <section className='w-full flex-center flex-col'>
      <div className='head_text text-center dark:text-gray-300'>
        <span className='blue_gradient text-center'> Next Post</span>
      </div>
      <p className='desc text-center dark:text-gray-400'>
        A modern messanger for communication, creation and sharing posts.
      </p>
      <Provider>
        <div className='flex md:hidden w-full justify-center gap-3 mt-3 -mb-6'>
          <Link href='/create-post' className={(status === 'authenticated') ? 'black_btn' : 'hidden'}>
            Create Post
          </Link>
          <Link href='/chat' className={(status === 'authenticated') ? 'chat_btn' : 'hidden'}>
            Open Chats
          </Link>
        </div>
        <Feed/>
        <ScrollToTop/>
        <ToastContainer/>
      </Provider>
    </section>
  );
};

export default Home;
