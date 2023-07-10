'use client'

import PostCard from './PostCard';
import Masonry from 'react-masonry-css'
import ProfileHeader from "~/components/ProfileHeader";

const breakpointColumnsObj = {
  default: 2,
  1130: 1,
};

const Profile = ({ name, session, data, handleEdit, handleDelete }) => {
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
            handleEdit={() => handleEdit && handleEdit(post)}
            handleDelete={() => handleDelete && handleDelete(post)}
          />
        ))}
      </Masonry>
    </section>
  );
};

export default Profile;
