import {CiCircleRemove} from "react-icons/ci";

const CloseButton = ({ isMobile, handleFileChange}) => {
  return (
    <div className='flex items-center justify-center h-8 w-8 '>
      <button
        onClick={(e) => {
          e.preventDefault();
          handleFileChange(null);
        }}
        className={isMobile ? 'w-10 h-10 text-red-700' : 'w-10 h-10 text-red-700 -mr-5'}
      >
        <CiCircleRemove
          className='w-6 h-6'/>
      </button>
    </div>
  );
};

export default CloseButton;
