"use client";

import { useState, useEffect } from "react";
import PostCard from "./PostCard";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useSession } from "next-auth/react";
import {CiCircleRemove} from "react-icons/ci";
import InfiniteScroll from 'react-infinite-scroll-component';

const PostCardList = ({ data, handleTagClick }) => {

  return (
    <>
      <div className='mt-16 post_layout'>
        {data.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            handleTagClick={handleTagClick}
          />
        ))}
      </div>
      <ToastContainer />
    </>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);
  const { data: session, status } = useSession();

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/post?page=1&limit=4`);
      const newPosts = await res.json();

      setAllPosts(allPosts.concat(newPosts));
      setPage(page + 1);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  useEffect(() => {
    if (status !== 'loading') {
      fetchPosts();
    }
  }, [status, page]);

  const filterPosts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.post)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPosts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPosts(tagName);
    setSearchedResults(searchResult);
  };

  return (
    <section className='feed'>
      <form className='relative w-full flex-center items-center'>
        <input
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          className='search_input peer'
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            setSearchText("");
          }}
          className='w-10 h-11 absolute right-0 top-0'
        >
          <CiCircleRemove
            className='w-6 h-6'/>
        </button>
      </form>

      <InfiniteScroll
        dataLength={allPosts.length}
        next={fetchPosts}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
        {searchText ? (
          <PostCardList
            data={searchedResults}
            handleTagClick={handleTagClick}
          />
        ) : (
          <PostCardList data={allPosts} handleTagClick={handleTagClick} />
        )}
      </InfiniteScroll>
    </section>
  );
};

export default Feed;
