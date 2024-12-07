const loaderStyle =
  "flex w-full flex-grow my-2 bg-gradient-to-r from-primary-100/30 via-primary-300 to-secondary-400/50 animate-gradient-x bg-rounded-md rounded-md";

export const LoadingBar = ({ isMessage }) => {
  return (
    <div
      className={isMessage ? `h-0 ${loaderStyle}` : `h-0 ${loaderStyle}`}
    ></div>
  );
};

export const EndMessage = () => {
  return (
    <div className="flex w-full h-4 items-center justify-center">
      <p>Yay! You have seen it all</p>
    </div>
  );
};

export const Loader = () => {
  return (
    <div
      aria-label="Loading..."
      role="status"
      className="flex items-center space-x-2"
    >
      <svg className="h-12 w-12 animate-spin stroke-gray-500" viewBox="0 0 256 256">
        <line
          x1="128"
          y1="32"
          x2="128"
          y2="64"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="20"
        ></line>
        <line
          x1="195.9"
          y1="60.1"
          x2="173.3"
          y2="82.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="20"
        ></line>
        <line
          x1="224"
          y1="128"
          x2="192"
          y2="128"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="20"
        ></line>
        <line
          x1="195.9"
          y1="195.9"
          x2="173.3"
          y2="173.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="20"
        ></line>
        <line
          x1="128"
          y1="224"
          x2="128"
          y2="192"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="20"
        ></line>
        <line
          x1="60.1"
          y1="195.9"
          x2="82.7"
          y2="173.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="20"
        ></line>
        <line
          x1="32"
          y1="128"
          x2="64"
          y2="128"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="20"
        ></line>
        <line
          x1="60.1"
          y1="60.1"
          x2="82.7"
          y2="82.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="20"
        ></line>
      </svg>
      <span className="text-2xl font-medium text-gray-500">Loading...</span>
    </div>
  );
};
