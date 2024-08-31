"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useContext, useState, useRef, useEffect } from "react";
import { CiCircleRemove } from "react-icons/ci";
import { PostCardList } from "~/components/PostCardList";
import { LoadingBar } from "~/components/Loading";
import InfiniteScroll from "react-infinite-scroll-component";
import { BsColumns } from "react-icons/bs";
import { TbColumns1 } from "react-icons/tb";
import { DisplayContext } from "~/app/provider";
import { useMobileCheck } from "~/utils/hooks/useMobileCheck";

const fetchPosts = async ({ pageParam = 1 }) => {
  const response = await fetch(`/api/post?page=${pageParam}&limit=4`);
  return response.json();
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);
  const { columnView, setColumnView } = useContext(DisplayContext);
  const isMobile = useMobileCheck();
  const loaderRef = useRef();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, pages) => {
      if (pages.length * 4 < lastPage.totalPosts) {
        return pages.length + 1;
      }
      return undefined;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  useEffect(() => {
    if (data) {
      setAllPosts((prevPosts) => {
        const newPosts = data.pages.flatMap((page) => page.posts);
        const uniquePosts = [
          ...new Map(
            [...prevPosts, ...newPosts].map((post) => [post._id, post])
          ).values(),
        ];
        return uniquePosts;
      });
    }
  }, [data]);


  const filterPosts = useCallback(
    (searchtext) => {
      const normalizedSearchText = searchtext.replace(/^#/, "").toLowerCase();
      const regex = new RegExp(searchtext, "i");
      return allPosts.filter(
        (item) =>
          regex.test(item.creator.username) ||
          regex.test(item.tag) ||
          (item.tag &&
            item.tag
              .split(",")
              .some((tag) =>
                tag
                  .trim()
                  .replace(/^#/, "")
                  .toLowerCase()
                  .includes(normalizedSearchText)
              ))
      );
    },
    [allPosts]
  );

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

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

  if (status === "loading") return <LoadingBar isMessage={false} />;
  if (status === "error") return <div>Error fetching posts: {error.message}</div>;

  return (
    <section className="feed">
      <div className="flex w-full items-center justify-between gap-3">
        <div className={isMobile ? "hidden" : "cursor-pointer"}>
          {columnView ? (
            <BsColumns
              onClick={() => setColumnView(!columnView)}
              className="w-8 h-8 font-light"
            />
          ) : (
            <TbColumns1
              onClick={() => setColumnView(!columnView)}
              className="w-8 h-8 font-light"
            />
          )}
        </div>
        <form className="relative w-full flex-center items-center">
          <input
            type="text"
            placeholder="Search for a tag or a username"
            value={searchText}
            onChange={handleSearchChange}
            className="search_input peer dark:text-gray-300 dark:bg-gray-800/30"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setSearchText("");
            }}
            className="w-10 h-11 absolute right-0 top-0"
          >
            <CiCircleRemove className="w-6 h-6" />
          </button>
        </form>
      </div>

      <InfiniteScroll
        dataLength={allPosts.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={isFetchingNextPage && <div ref={loaderRef} isMessage={false} />}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        refreshFunction={refetch}
        pullDownToRefresh
        pullDownToRefreshThreshold={100}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: "center", marginTop: "50px" }}>
            &#8595; Pull down to refresh
          </h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: "center", marginTop: "50px" }}>
            &#8593; Release to refresh
          </h3>
        }
      >
        <PostCardList
          columnView={columnView}
          data={searchText ? searchedResults : allPosts}
          handleTagClick={handleTagClick}
        />
      </InfiniteScroll>
    </section>
  );
};

export default Feed;
