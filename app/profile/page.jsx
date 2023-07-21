'use client';

import {useSession} from 'next-auth/react';
import {useEffect, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';

import Profile from '~/components/Profile';
import axios from "axios";
import {LoadingBar} from "~/components/Loading";

const MyProfile = () => {
  const pathname = usePathname()
  const [myPosts, setMyPosts] = useState([]);
  const {data: session, status} = useSession();

  useEffect(() => {
    if (status === 'loading' || !session) return;

    axios.get(`/api/users/${session?.user?.id}/posts`)
      .then(response => {
        setMyPosts(response.data);
      })
      .catch(error => console.error(error));

  }, [session?.user]);

  return (
    <>
      {!session?.user ? (
        <LoadingBar/>
      ) : (
        <Profile // ЧЕКНИ ЧТО БУДЕТ ЕСЛИ ОСТАВИТЬ ТОЛЬКО ПРФИЛЬ В АДРЕСЕ И ИСПРАВЬ ЭТО
          name={pathname}
          data={myPosts}
          session={session?.user.id}
          myPosts={myPosts}
          setMyPosts={setMyPosts}
        />
      )}
    </>
  );
};

export default MyProfile;
