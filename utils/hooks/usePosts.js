import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const fetchPosts = async ({ pageParam = 1 }) => {
    const response = await fetch(`/api/post?page=${pageParam}&limit=4`);
    if (!response.ok) {
        throw new Error("Failed to fetch posts");
    }
    return response.json();
};

export const usePosts = () => {
    const [allPosts, setAllPosts] = useState([]);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, refetch, error } = useInfiniteQuery({
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
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });

    // Update allPosts when data changes
    useEffect(() => {
        if (data) {
            setAllPosts((prevPosts) => {
                const newPosts = data.pages.flatMap((page) => page.posts || []);
                const uniquePosts = [...new Map([...prevPosts, ...newPosts].map((post) => [post._id, post])).values()];
                return uniquePosts;
            });
        }
    }, [data]);

    return {
        allPosts,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        refetch,
        error,
        isLoading: status === "loading",
        isError: status === "error",
    };
};
