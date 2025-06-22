"use client";

import axios from "axios";
import { usePathname } from "next/navigation";
import { useContext,useEffect, useState } from "react";

import { Loader } from "~/components/Loading";
import Profile from "~/components/Profile";
import { SessionContext } from "~/utils/context/SocketContext";

const MyProfile = () => {
    const pathname = usePathname();
    const [myPosts, setMyPosts] = useState([]);
    const sessionId = useContext(SessionContext);

    useEffect(() => {
        if (!sessionId) {return;}

        axios
            .get(`/api/users/${sessionId}/posts`)
            .then((response) => {
                setMyPosts(response.data);
            })
            .catch((error) => console.error(error));
    }, [sessionId]);

    return (
        <>
            {!sessionId ? (
                <Loader />
            ) : (
                <Profile
                    name={pathname}
                    data={myPosts}
                    session={sessionId}
                    myPosts={myPosts}
                    setMyPosts={setMyPosts}
                />
            )}
        </>
    );
};

export default MyProfile;
