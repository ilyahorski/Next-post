import { useEffect, useState } from "react";

export const useUserStatus = (socket, sessionUserId) => {
    const [userStatuses, setUserStatuses] = useState({});

    useEffect(() => {
        if (!socket || !sessionUserId) {return;}

        const updateStatus = (status) => {
            socket.emit("setUserStatus", { userId: sessionUserId, status });
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                updateStatus("offline");
            } else {
                updateStatus("online");
            }
        };

        const handleFocus = () => updateStatus("online");
        const handleBlur = () => updateStatus("offline");

        // Set initial status
        updateStatus("online");

        // Add event listeners
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("focus", handleFocus);
        window.addEventListener("blur", handleBlur);

        // Send status update every 10 seconds
        const statusInterval = setInterval(() => updateStatus("online"), 10000);

        // Listen for user status updates
        const handleUserStatusUpdated = ({ userId, status, username }) => {
            setUserStatuses((prevStatuses) => ({
                ...prevStatuses,
                [userId]: { status, username },
            }));
        };

        socket.on("userStatusUpdated", handleUserStatusUpdated);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("blur", handleBlur);
            clearInterval(statusInterval);
            socket.off("userStatusUpdated", handleUserStatusUpdated);
            updateStatus("offline");
        };
    }, [socket, sessionUserId]);

    return userStatuses;
};
