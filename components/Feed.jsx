"use client";

import { useContext, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { DisplayContext } from "~/app/provider";
import { LoadingBar } from "~/components/Loading";
import { PostCardList } from "~/components/PostCardList";
import { useMobileCheck } from "~/utils/hooks/useMobileCheck";
import { usePosts } from "~/utils/hooks/usePosts";
import { usePostSearch } from "~/utils/hooks/usePostSearch";

import { FeedHeader } from "./feed";

const Feed = () => {
    const { columnView, setColumnView } = useContext(DisplayContext);
    const isMobile = useMobileCheck();

    const {
        allPosts,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch,
    } = usePosts();

    const {
        searchText,
        searchedResults,
        handleSearchChange,
        handleTagClick,
        clearSearch,
    } = usePostSearch(allPosts);

    const handleToggleView = () => {
        setColumnView(!columnView);
    };

    // Memoize the posts to display to avoid unnecessary re-renders
    const postsToDisplay = useMemo(() => {
        return searchText ? searchedResults : allPosts;
    }, [searchText, searchedResults, allPosts]);

    if (isLoading) {
        return <LoadingBar isMessage={false} />;
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <div className="text-red-500 mb-4">Error fetching posts</div>
                <div className="text-gray-600 mb-4">{error?.message}</div>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <section className="feed">
            <FeedHeader
                searchText={searchText}
                onSearchChange={handleSearchChange}
                onClearSearch={clearSearch}
                columnView={columnView}
                onToggleView={handleToggleView}
                isMobile={isMobile}
            />

            <InfiniteScroll
                dataLength={postsToDisplay.length}
                next={fetchNextPage}
                hasMore={hasNextPage && !searchText}
                loader={
                    isFetchingNextPage && (
                        <div className="flex justify-center py-4">
                            <LoadingBar isMessage={false} />
                        </div>
                    )
                }
                endMessage={
                    <div className="text-center py-8">
                        <p className="text-gray-600 dark:text-gray-400">
                            <b>
                                {searchText
                                    ? `Found ${postsToDisplay.length} posts`
                                    : "Yay! You have seen it all"}
                            </b>
                        </p>
                    </div>
                }
                refreshFunction={refetch}
                pullDownToRefresh={!searchText} // Disable pull to refresh when searching
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
                    data={postsToDisplay}
                    handleTagClick={handleTagClick}
                />
            </InfiniteScroll>
        </section>
    );
};

export default Feed;
