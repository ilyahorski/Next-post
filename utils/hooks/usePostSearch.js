import { useCallback, useEffect,useRef, useState } from "react";

export const usePostSearch = (allPosts) => {
    const [searchText, setSearchText] = useState("");
    const [searchedResults, setSearchedResults] = useState([]);
    const searchTimeoutRef = useRef(null);

    const filterPosts = useCallback(
        (searchtext) => {
            if (!searchtext.trim()) {
                return [];
            }

            const normalizedSearchText = searchtext.replace(/^#/, "").toLowerCase();
            const regex = new RegExp(searchtext, "i");
      
            return allPosts.filter((item) => {
                // Search in username
                if (regex.test(item.creator?.username)) {return true;}
        
                // Search in tags
                if (regex.test(item.tag)) {return true;}
        
                // Search in individual tags (comma-separated)
                if (item.tag) {
                    return item.tag
                        .split(",")
                        .some((tag) =>
                            tag
                                .trim()
                                .replace(/^#/, "")
                                .toLowerCase()
                                .includes(normalizedSearchText)
                        );
                }
        
                return false;
            });
        },
        [allPosts]
    );

    const handleSearchChange = useCallback((e) => {
        const value = e.target.value;
        setSearchText(value);

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout for search
        searchTimeoutRef.current = setTimeout(() => {
            const searchResult = filterPosts(value);
            setSearchedResults(searchResult);
        }, 500);
    }, [filterPosts]);

    const handleTagClick = useCallback((tagName) => {
        setSearchText(tagName);
        const searchResult = filterPosts(tagName);
        setSearchedResults(searchResult);
    }, [filterPosts]);

    const clearSearch = useCallback(() => {
        setSearchText("");
        setSearchedResults([]);
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    return {
        searchText,
        searchedResults,
        handleSearchChange,
        handleTagClick,
        clearSearch,
    };
};
