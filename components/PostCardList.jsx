import PostCard from "@/components/PostCard";
import 'react-toastify/dist/ReactToastify.css';
import Masonry from 'react-masonry-css'

const breakpointColumnsObj = {
  default: 2,
  1130: 1,
};


export const PostCardList = ({ data, handleTagClick }) => {

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {data.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            handleTagClick={handleTagClick}
          />
        ))}
      </Masonry>
    </>
  );
};
