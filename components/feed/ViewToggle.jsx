import { BsColumns } from "react-icons/bs";
import { TbColumns1 } from "react-icons/tb";

const ViewToggle = ({ columnView, onToggleView, isMobile }) => {
  if (isMobile) return null;

  return (
    <div className="cursor-pointer">
      {columnView ? (
        <BsColumns
          onClick={onToggleView}
          className="w-8 h-8 font-light"
          title="Switch to single column view"
        />
      ) : (
        <TbColumns1
          onClick={onToggleView}
          className="w-8 h-8 font-light"
          title="Switch to multi column view"
        />
      )}
    </div>
  );
};

export default ViewToggle;
