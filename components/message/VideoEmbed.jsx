import Link from "next/link";
import { useEffect, useState } from "react";

const VideoEmbed = ({ url }) => {
    const [tiktokLoaded, setTiktokLoaded] = useState(false);

    const getEmbedInfo = (url) => {
        const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|shorts\/)?([a-zA-Z0-9_-]+)/;
        const tiktokRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:tiktok\.com)\/@([\w.-]+)\/video\/(\d+)/;

        const youtubeMatch = url.match(youtubeRegex);
        const tiktokMatch = url.match(tiktokRegex);

        if (youtubeMatch) {
            return {
                type: "youtube",
                embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
            };
        }
        if (tiktokMatch) {
            return { type: "tiktok", videoId: tiktokMatch[2] };
        }

        return { type: "unknown" };
    };

    const { type, embedUrl, videoId } = getEmbedInfo(url);

    useEffect(() => {
        if (type === "tiktok") {
            const script = document.createElement("script");
            script.src = "https://www.tiktok.com/embed.js";
            script.async = true;
            script.onload = () => setTiktokLoaded(true);
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
    }, [type]);

    const renderEmbed = () => {
        switch (type) {
            case "youtube":
                return (
                    <>
                        <iframe
                            width="100%"
                            height="315"
                            src={embedUrl}
                            title="YouTube video player"
                            style={{ border: "none" }}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        <Link href={url} className="text-blue-500 underline">
                            {url}
                        </Link>
                    </>
                );
            case "tiktok":
                return (
                    <>
                        {tiktokLoaded ? (
                            <blockquote
                                className="tiktok-embed"
                                cite={url}
                                data-video-id={videoId}
                                style={{ maxWidth: "605px", minWidth: "325px" }}
                            >
                                <section>
                                    <a
                                        target="_blank"
                                        title="@username"
                                        href={"https://www.tiktok.com/@username"} rel="noreferrer"
                                    >
                                        @username
                                    </a>
                                </section>
                            </blockquote>
                        ) : (
                            <div> TikTok loaded...</div>
                        )}
                        <Link href={url} className="text-blue-500 underline">
                            {url}
                        </Link>
                    </>
                );
            default:
                return (
                    <Link href={url} className="text-blue-500 underline">
                        {url}
                    </Link>
                );
        }
    };

    return <div className="max-w-[300px]">{renderEmbed()}</div>;
};

export default VideoEmbed;
