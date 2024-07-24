'use client'

import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {CiCircleRemove} from "react-icons/ci";
import {PostCardList} from "~/components/PostCardList";
import {LoadingBar} from "~/components/Loading";
import InfiniteScroll from 'react-infinite-scroll-component';
import {BsColumns} from "react-icons/bs";
import {TbColumns1} from "react-icons/tb";
import {DisplayContext} from "~/app/provider";
import {useMobileCheck} from "~/utils/hooks/useMobileCheck";
import {SessionContext} from "~/utils/context/SocketContext";

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [postsCount, setPostsCount] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);
  const {columnView, setColumnView} = useContext(DisplayContext);
  const isMobile = useMobileCheck();
  const loaderRef = useRef();
  const sessionId = useContext(SessionContext);

  useEffect(() => {
    if (sessionId) {
      fetchPosts();
    }
  }, [sessionId]);

  const fetchPosts = useCallback(async () => {
    if (allPosts.length >= postsCount) {
      setHasMore(false);
      return;
    }

    const response = await fetch(`/api/post?page=${page}&limit=4`);
    const data = await response.json();

    setPostsCount(data.totalPosts);
    setAllPosts((prevPosts) => [...prevPosts, ...data.posts]);
    setPage((prevPage) => prevPage + 1);
  }, [allPosts, postsCount, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          fetchPosts();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [fetchPosts, loaderRef]);


  const filterPosts = (searchtext) => {
    const normalizedSearchText = searchtext.replace(/^#/, '').toLowerCase();
    const regex = new RegExp(searchtext, "i");
    return allPosts.filter(
      (item) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        item.tag && item.tag.split(',')
        .some(tag => tag.trim().replace(/^#/, '').toLowerCase().includes(normalizedSearchText))
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
      <div className='flex w-full items-center justify-between gap-3'>
        <div className={isMobile ? 'hidden' : 'cursor-pointer'}>
          {columnView ? (
            <BsColumns
              onClick={() => setColumnView(!columnView)}
              className='w-8 h-8 font-light'
            />
          ) : (
            <TbColumns1
              onClick={() => setColumnView(!columnView)}
              className='w-8 h-8 font-light'
            />
          )
          }
        </div>
        <form className='relative w-full flex-center items-center'>
          <input
            type='text'
            placeholder='Search for a tag or a username'
            value={searchText}
            onChange={handleSearchChange}
            className='search_input peer dark:text-gray-300 dark:bg-gray-800/30'
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
      </div>

      <InfiniteScroll
        dataLength={allPosts.length}
        next={fetchPosts}
        hasMore={hasMore}
        loader={<LoadingBar ref={loaderRef} isMessage={false}/>}
        refreshFunction={fetchPosts}
        endMessage={
          <p style={{textAlign: "center"}}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        pullDownToRefresh
        pullDownToRefreshThreshold={100}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: 'center', marginTop: '50px' }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: 'center', marginTop: '50px' }}>&#8593; Release to refresh</h3>
        }
      >
        {searchText ? (
          <PostCardList
            columnView={columnView}
            data={searchedResults}
            handleTagClick={handleTagClick}
          />
        ) : (
          <PostCardList
            columnView={columnView}
            data={allPosts}
            handleTagClick={handleTagClick}
          />
        )}
      </InfiniteScroll>
    </section>
  );
};

export default Feed;
