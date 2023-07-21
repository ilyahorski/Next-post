'use client'

import PostCard from './PostCard';
import Masonry from 'react-masonry-css'
import ProfileHeader from "~/components/ProfileHeader";

const breakpointColumnsObj = {
  default: 2,
  1130: 1,
};

const Profile = ({ name, myPosts, setMyPosts, session, data}) => {
  return (
    <section className='profile'>
      <ProfileHeader
        name={name}
        session={session}
        data={data}
      />

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {data.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            myPosts={myPosts}
            setMyPosts={setMyPosts}
          />
        ))}
      </Masonry>
    </section>
  );
};

export default Profile;
