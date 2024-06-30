'use client';

import {useEffect, useState, useContext} from 'react';
import {usePathname} from 'next/navigation';
import Profile from '~/components/Profile';
import axios from "axios";
import {LoadingBar} from "~/components/Loading";
import {SessionContext} from "~/utils/context/SocketContext";

const MyProfile = () => {
  const pathname = usePathname()
  const [myPosts, setMyPosts] = useState([]);
  const sessionId = useContext(SessionContext);

  useEffect(() => {
    if (!sessionId) return;

    axios.get(`/api/users/${sessionId}/posts`)
      .then(response => {
        setMyPosts(response.data);
      })
      .catch(error => console.error(error));

  }, [sessionId]);

  return (
    <>
      {!sessionId ? (
        <LoadingBar/>
      ) : (
        <Profile
          name={pathname}
          data={myPosts}
          session={sessionId}
          myPosts={myPosts}
          setMyPosts={setMyPosts}
        />
      )}
    </>
  );
};

export default MyProfile;
