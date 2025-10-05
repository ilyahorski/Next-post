"use client";

import { useParams } from "next/navigation";
import { Resizable } from "re-resizable";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Draggable from "react-draggable";

import VideoApp from "~/components/videoCallComponents/VideoApp";
import { VideoSocketContext } from "~/utils/context/VideoContext";

const VideoCallPlayer = () => {
    const [chat, setChat] = useState(null);
    const [isResizing, setIsResizing] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [bounds, setBounds] = useState(null);

    const { width, height, setWidth, setHeight } = useContext(VideoSocketContext);
    const { id: chatId } = useParams();

    const clampPosition = useCallback(
        (pos, bnds = bounds) => {
            if (!bnds) {
                return pos;
            }

            const clampedX = Math.min(Math.max(pos.x, bnds.left), bnds.right);
            const clampedY = Math.min(Math.max(pos.y, bnds.top), bnds.bottom);

            return { x: clampedX, y: clampedY };
        },
        [bounds],
    );

    const updateBounds = useCallback(
        (overrideWidth, overrideHeight) => {
            if (typeof window === "undefined") {
                return;
            }

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const effectiveWidth = overrideWidth ?? width;
            const effectiveHeight = overrideHeight ?? height;

            const newBounds = {
                left: 0,
                top: 0,
                right: Math.max(0, viewportWidth - effectiveWidth),
                bottom: Math.max(0, viewportHeight - effectiveHeight),
            };

            setBounds(newBounds);
            setPosition((prevPosition) => clampPosition(prevPosition, newBounds));
        },
        [clampPosition, height, width],
    );

    const onResizeStart = (e) => {
        e.stopPropagation();
        setIsResizing(true);
    };

    const onResizeEnd = (e, direction, ref, d) => {
        e.stopPropagation();
        setIsResizing(false);
        const nextWidth = width + d.width;
        const nextHeight = height + d.height;
        setWidth(nextWidth);
        setHeight(nextHeight);
        updateBounds(nextWidth, nextHeight);
    };

    const onDrag = (e, data) => {
        if (!isResizing) {
            setPosition(clampPosition({ x: data.x, y: data.y }));
        }
    };

    useEffect(() => {
        if (!chatId) {
            return;
        }
        const getChat = async () => {
            const response = await fetch(`/api/chats/${chatId}`);
            const data = await response.json();

            setChat(data.membersList);
        };

        if (chatId) {
            getChat();
        }
    }, [chatId]);

    useEffect(() => {
        updateBounds();
    }, [updateBounds]);

    useEffect(() => {
        const handleResize = () => {
            updateBounds();
        };

        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResize);
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("resize", handleResize);
            }
        };
    }, [updateBounds]);

    if (!chat || !chatId) {
        return null;
    }

    return (
        <Draggable
            disabled={isResizing}
            position={position}
            onDrag={onDrag}
            cancel="#noDrag, #noMainDrag, #userDrag, #noExpandDrag"
            bounds={bounds ?? undefined}
        >
            <div className="fixed resize z-[100] rounded-lg" style={{ top: position.y, left: position.x }}>
                <Resizable
                    defaultSize={{
                        width: 320,
                        height: 500,
                    }}
                    size={{
                        width: width,
                        height: height,
                    }}
                    minHeight={200}
                    minWidth={175}
                    onResizeStart={onResizeStart}
                    onResizeStop={onResizeEnd}
                    className="rounded-lg "
                >
                    <VideoApp chatMembers={chat} />
                </Resizable>
            </div>
        </Draggable>
    );
};

export default VideoCallPlayer;
