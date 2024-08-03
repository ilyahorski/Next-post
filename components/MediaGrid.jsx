import React from "react";
import Masonry from "react-masonry-css";
import Image from "next/image";
import ReactPlayer from "react-player";

const MediaGrid = ({ media }) => {
  if (media.length === 0) {
    return null;
  }

  const getFileType = (url) => {
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    return filename.split("-")[0];
  };

  const renderFile = (url, index) => {
    const fileType = getFileType(url);

    switch (fileType) {
      case "image":
        return (
          <Image
            className="rounded-md max-w-[300px]"
            src={url}
            quality={30}
            alt={`media-${index}`}
            layout="responsive"
            width={500}
            height={500}
          />
        );
      case "video":
        return (
          <div className="max-w-[300px]">
            <ReactPlayer width="100%" height="100%" controls url={url} />
          </div>
        );
      case "audio":
        return (
          <audio controls id="song" className="block w-[300px] px-1 mr-8">
            <source src={url} type="audio/mpeg" />
          </audio>
        );
      case "application":
      case "text":
        const extension = url.split(".").pop();
        return (
          <div className="w-[300px] p-2 mr-8 bg-gray-700 rounded-md">
            <p className="font-normal truncate">{url.split("-original-")[url.split("-original-").length - 1].split('.')[0]}</p>
            <p className="text-sm text-gray-200 pb-2">{`Type: ${extension}`}</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View File
            </a>
          </div>
        );
      default:
        return <p>Unsupported file type</p>;
    }
  };

  const audioAndTextFiles = media.filter((url) => {
    const fileType = getFileType(url);
    return (
      fileType === "audio" || fileType === "application" || fileType === "text"
    );
  });

  const imageAndVideoFiles = media.filter((url) => {
    const fileType = getFileType(url);
    return fileType === "image" || fileType === "video";
  });

  const breakpointColumnsObj = {
    default: imageAndVideoFiles.length !== 3 ? imageAndVideoFiles.length : 3,
    1100: imageAndVideoFiles.length !== 2 ? imageAndVideoFiles.length : 2,
    700: 1,
  };

  return (
    <div className="media-grid">
      {imageAndVideoFiles.length > 0 && (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex mx-1 w-auto"
          columnClassName="bg-clip-padding p-1"
        >
          {imageAndVideoFiles.map((url, index) => (
            <div key={index}>{renderFile(url, index)}</div>
          ))}
        </Masonry>
      )}
      {audioAndTextFiles.length > 0 && (
        <div className="flex flex-col space-y-4 mt-4">
          {audioAndTextFiles.map((url, index) => (
            <div key={index}>{renderFile(url, index)}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaGrid;
