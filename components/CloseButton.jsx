import {CiCircleRemove} from "react-icons/ci";

const CloseButton = ({ isMobile, handleFileChange}) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        handleFileChange(null);
      }}
      className={isMobile ? 'w-10 h-10 text-red-700' : 'w-10 h-10 absolute right-3 bottom-3 text-red-700'}
    >
      <CiCircleRemove
        className={isMobile ? 'w-[23px] h-6' : 'w-6 h-6'}/>
    </button>
  );
};

export default CloseButton;
