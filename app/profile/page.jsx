'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Profile from '@/components/Profile';
import axios from "axios";

const MyProfile = () => {
  const router = useRouter();
  const [myPosts, setMyPosts] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {

    if (status === 'loading' || !session) return;

    axios.get(`/api/users/${session?.user?.id}/posts`)
      .then(response => {
        setMyPosts(response.data);
      })
      .catch(error => console.error(error));


  }, [status, session?.user]);

  const handleEdit = (post) => {
    router.push(`/update-post?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      'Are you sure you want to delete this post?',
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/post/${post._id.toString()}`, {
          method: 'DELETE',
        });

        const filteredPosts = myPosts.filter((item) => item._id !== post._id);

        setMyPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Profile
      name='My'
      desc='Welcome to your personalized profile page. Share your exceptional posts and inspire others with the power of your imagination'
      data={myPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
