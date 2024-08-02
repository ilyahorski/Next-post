import Masonry from "react-masonry-css";
import Image from "next/image";
import ReactPlayer from "react-player";

const MediaGrid = ({ media }) => {
  if (media.length === 0) {
    return null;
  }

  if (media.length === 1) {
    const [file] = media;
    const fileType = file.split("/")[4].split("-")[0];

    return (
      <div className="mx-1 mb-3 max-w-[300px]">
        {fileType === "image" ? (
          <Image
            className="rounded-md"
            src={media[0]}
            quality={60}
            alt="media"
            layout="responsive"
            width={300}
            height={300}
          />
        ) : (
          <ReactPlayer
            width="100%"
            height="100%"
            controls
            url={file}
          />
        )}
      </div>
    );
  }

  const breakpointColumnsObj = {
    default: media.length !== 3 ? media.length : 3,
    1100: media.length !== 2 ? media.length : 2,
    700: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="flex mx-1 w-auto"
      columnClassName="bg-clip-padding p-1"
    >
      {media.map((url, index) => {
        const fileType = url.split("/")[4].split("-")[0];

        return (
          <div key={index}>
            {fileType === "image" ? (
              <Image
                className="rounded-md"
                src={url}
                quality={60}
                alt={`media-${index}`}
                layout="responsive"
                width={500}
                height={500}
              />
            ) : (
              <ReactPlayer
                width="100%"
                height="100%"
                url={url}
              />
            )}
          </div>
        );
      })}
    </Masonry>
  );
};

export default MediaGrid;
