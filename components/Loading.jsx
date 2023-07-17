const loaderStyle = "my-2 bg-gradient-to-r from-primary-100/30 via-primary-300 to-secondary-400/50 animate-gradient-x bg-rounded-md rounded-md"

export const LoadingBar = ({ isMessage }) => {
  return (
    <div className={isMessage ? `h-0.5 ${loaderStyle}` : `h-3 ${loaderStyle}`}>
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
