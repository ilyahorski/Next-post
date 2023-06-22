
const Sceleton = () => {
  return (
    <div
      className='flex-1 break-inside-avoid rounded-lg border border-gray-300 bg-white/20 bg-clip-padding p-6 pb-4 backdrop-blur-lg backdrop-filter xs:w-[510px] w-[370px] h-fit animate-pulse'>
      <div className='h-14 bg-gray-400 rounded w-2/4 mb-4'></div>
      <div className='h-[280px] bg-gray-400 rounded mb-6'></div>
      <div className='space-y-4'>
        <div className='h-4 bg-gray-400 rounded w-full mb-4'></div>
      </div>
      <div className='flex space-x-2 mt-4'>
        <div className='h-4 bg-gray-400 rounded w-4/6 mb-2'></div>
      </div>
    </div>
  );
};

export default Sceleton;
