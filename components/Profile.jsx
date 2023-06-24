'use client'

import PostCard from './PostCard';
import Masonry from 'react-masonry-css'

const breakpointColumnsObj = {
  default: 2,
  1130: 1,
};

const Profile = async ({ name, desc, data, handleEdit, handleDelete }) => {
  return (
    <section className='w-full'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>{name} Profile</span>
      </h1>
      <p className='desc text-left'>{desc}</p>

      {data ? (
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
      ) : (
        <div className='border-2 border-amber-950'>You are not authorized, Please Log in!</div>
      )}

    </section>
  );
};

export default Profile;
