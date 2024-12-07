import Feed from "~/components/Feed";

import { ScrollToTop } from "~/components/ScrollToTop";
import { ToastContainer } from "react-toastify";
import Link from "next/link";
import { getServerSession } from "next-auth/next"
import {authOptions} from '../app/api/auth/[...nextauth]/route'

const Home = async () => {
  const session = await getServerSession(authOptions)

  const error = console.error;
  console.error = (...args) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };

  return (
    <section className="w-full flex-center flex-col">
      <p className="desc text-center dark:text-gray-400 -mt-6">
        A modern messanger for communication, creation and sharing posts.
      </p>
      <div className="flex md:hidden w-full justify-center gap-3 mt-3 -mb-6">
          <Link
            href="/create-post"
            className={!!session?.user.id ? "black_btn" : "hidden"}
          >
            Create Post
          </Link>
          <Link
            href="/chat"
            className={!!session?.user.id ? "chat_btn" : "hidden"}
          >
            Open Chats
          </Link>
        </div>
        <Feed />
        <ScrollToTop />
        <ToastContainer />
    </section>
  );
};

export default Home;
