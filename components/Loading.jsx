export const LoadingBar = () => {
  return (
    <div className="h-3 -mt-3 mb-3 bg-gradient-to-r from-primary-100/30 via-primary-300 to-secondary-400/50 animate-gradient-x bg-rounded-md rounded-md">
    </div>
  );
};

export const EndMessage = () => {
  return (
    <div className='flex w-full h-4 items-center justify-center'>
      <p>Yay! You have seen it all</p>
    </div>
  )
}
