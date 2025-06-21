import { CiCircleRemove } from "react-icons/ci";

const SearchBar = ({ searchText, onSearchChange, onClearSearch }) => {
  return (
    <form className="relative w-full flex-center items-center">
      <input
        type="text"
        placeholder="Search for a tag or a username"
        value={searchText}
        onChange={onSearchChange}
        className="search_input peer dark:text-gray-300 dark:bg-gray-800/30"
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          onClearSearch();
        }}
        className="w-10 h-11 absolute right-0 top-0"
        type="button"
      >
        <CiCircleRemove className="w-6 h-6" />
      </button>
    </form>
  );
};

export default SearchBar;
