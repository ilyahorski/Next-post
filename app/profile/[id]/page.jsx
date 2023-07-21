'use client';

import { useEffect, useState } from 'react';
import {useParams, useSearchParams} from 'next/navigation';
import Profile from '~/components/Profile';
import {useSession} from "next-auth/react";

const UserProfile = () => {
  const searchParams = useSearchParams();
  const userName = searchParams.get('name');
  const params = useParams()
  const { data: session, status } = useSession();

  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${params?.id}/posts`);
      const data = await response.json();

      setUserPosts(data);
    };

    if (params?.id) fetchPosts();
  }, []);

  return (
    <Profile
      name={userName}
      data={userPosts}
    />
  );
};

export default UserProfile;
