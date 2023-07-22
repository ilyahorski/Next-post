import PostCard from "~/components/PostCard";
import 'react-toastify/dist/ReactToastify.css';
import Masonry from 'react-masonry-css'

export const PostCardList = ({ data, columnView, handleTagClick }) => {
  const breakpointColumnsObj = {
    default: 2,
    1130: 1,
  };
  const breakpointColumn = {
    default: 1,
  };

  return (
    <>
      <Masonry
        breakpointCols={columnView ? breakpointColumn : breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {data.map((post) => (
          <PostCard
            columnView={columnView}
            key={post._id}
            post={post}
            handleTagClick={handleTagClick}
          />
        ))}
      </Masonry>
    </>
  );
};
