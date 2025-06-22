import SearchBar from "./SearchBar";
import ViewToggle from "./ViewToggle";

const FeedHeader = ({ searchText, onSearchChange, onClearSearch, columnView, onToggleView, isMobile }) => {
    return (
        <div className="flex w-full items-center justify-between gap-3">
            <ViewToggle columnView={columnView} onToggleView={onToggleView} isMobile={isMobile} />
            <SearchBar searchText={searchText} onSearchChange={onSearchChange} onClearSearch={onClearSearch} />
        </div>
    );
};

export default FeedHeader;
