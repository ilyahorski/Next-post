import { useEffect } from "react";

export const useMessageScroll = (newMessageGet, messageEndRef, formEndRef) => {
    useEffect(() => {
        let timeout;

        if (newMessageGet && messageEndRef.current && formEndRef.current) {
            const scrollMessageList = () => {
                return new Promise((resolve) => {
                    window.requestAnimationFrame(() => {
                        const messageList = document.getElementById("scrollableDiv");

                        if (messageList) {
                            messageEndRef.current.scrollIntoView({
                                block: "end",
                            });
                            resolve();
                        } else {
                            resolve();
                        }
                    });
                });
            };

            const scrollEntireContainer = () => {
                window.requestAnimationFrame(() => {
                    const container = document.getElementById("messagesContainer");

                    if (container) {
                        timeout = setTimeout(() => {
                            window.requestAnimationFrame(() =>
                                formEndRef.current.scrollIntoView({
                                    block: "end",
                                })
                            );
                        }, 200);
                    }
                });
            };

            scrollMessageList().then(scrollEntireContainer);
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [newMessageGet, messageEndRef, formEndRef]);
};
