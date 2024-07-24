"use client";

import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useId,
  useCallback,
} from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { useParams, useRouter } from "next/navigation";
import { PiPhoneSlashThin, PiPhoneCallThin } from "react-icons/pi";
import {
  FaVideo,
  FaVideoSlash,
  FaMicrophone,
  FaMicrophoneSlash,
} from "react-icons/fa";
import { BsArrowsAngleContract, BsArrowsAngleExpand } from "react-icons/bs";
import { VscCallOutgoing } from "react-icons/vsc";
import { MdOutlineCameraswitch } from "react-icons/md";
import { VideoSocketContext } from "~/utils/context/VideoContext";
import {SessionContext} from "~/utils/context/SocketContext";

const VideoApp = ({ chatMembers }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState();
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [isMainVideo, setIsMainVideo] = useState(true);
  const [receivedStream, setReceivedStream] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [devices, setDevices] = useState([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const [reciever, setReciever] = useState("");
  const { id: chatId } = useParams();

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();
  const connectionRef = useRef();

  const urlParams = new URLSearchParams(window.location.search);
  const openedFromPush = urlParams.get("source") === "push";
  const actionType = urlParams.get("type") === "reject";

  const router = useRouter();
  const sessionId = useContext(SessionContext);

  const { isVideoChatVisible, setIsVideoChatVisible, setWidth, setHeight } =
    useContext(VideoSocketContext);

  const icon_style = `${expanded ? "h-[20px] w-[20px]" : "h-[10px] w-[10px]"}`;
  const button_style = `text-white font-bold  ${
    expanded ? "h-[40px] w-[40px] px-[10px]" : "h-[20px] w-[20px] px-[5px]"
  }  rounded focus:outline-none focus:shadow-outline transform active:scale-95 transition duration-150 ease-in-out`;

  const iceServersConfig = {
    iceServers: [
      {
        urls: "stun:stun.relay.metered.ca:80",
      },
      {
        urls: "turn:standard.relay.metered.ca:80",
        username: process.env.NEXT_PUBLIC_METERED_USERNAME,
        credential: process.env.NEXT_PUBLIC_METERED_PASSWORD,
      },
      {
        urls: "turn:standard.relay.metered.ca:80?transport=tcp",
        username: process.env.NEXT_PUBLIC_METERED_USERNAME,
        credential: process.env.NEXT_PUBLIC_METERED_PASSWORD,
      },
      {
        urls: "turn:standard.relay.metered.ca:443",
        username: process.env.NEXT_PUBLIC_METERED_USERNAME,
        credential: process.env.NEXT_PUBLIC_METERED_PASSWORD,
      },
      {
        urls: "turns:standard.relay.metered.ca:443?transport=tcp",
        username: process.env.NEXT_PUBLIC_METERED_USERNAME,
        credential: process.env.NEXT_PUBLIC_METERED_PASSWORD,
      },
      { urls: "stun:freeturn.net:3478" },
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun3.l.google.com:19302" },
      { urls: "stun:stun4.l.google.com:19302" },
      { urls: "stun:freeturn.net:5349" },
      {
        urls: "turn:numb.viagenie.ca",
        username: "webrtc@live.com",
        credential: "muazkh",
      },
      {
        urls: "turn:freeturn.net:3478",
        username: "free",
        credential: "free",
      },
      {
        urls: "turn:freeturn.net:5349",
        username: "free",
        credential: "free",
      },
    ],
  };

  const toggleVideoImage = useCallback(() => {
    setIsMainVideo((prev) => !prev);
  }, []);

  const toggleContracted = useCallback(() => {
    setExpanded(true);
    setWidth(350);
    setHeight(500);
  }, [setWidth, setHeight]);

  const toggleExpanded = useCallback(() => {
    setExpanded(false);
    setWidth(175);
    setHeight(200);
  }, [setWidth, setHeight]);

  const toggleVideo = useCallback(() => {
    setIsVideoOn((prev) => !prev);
    stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
  }, [stream]);

  const toggleAudio = useCallback(() => {
    setIsAudioOn((prev) => !prev);
    stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
  }, [stream]);

  const getVideoDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);
    } catch (error) {
      console.log("Error enumerating video devices:", error);
    }
  }, []);

  const getUserMedia = useCallback(async () => {
    try {
      const videoDeviceId = devices[currentDeviceIndex]?.deviceId;
      const constraints = {
        video: { deviceId: videoDeviceId },
        audio: true,
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (userVideo.current) {
        userVideo.current.srcObject = newStream;
      }

      if (connectionRef.current) {
        const videoTrack = newStream.getVideoTracks()[0];
        const sender = connectionRef.current
          .getSenders()
          .find((s) => s.track.kind === "video");
        sender.replaceTrack(videoTrack);
      }
    } catch (error) {
      console.log("Error accessing media devices:", error);
    }
  }, [devices, currentDeviceIndex]);

  const toggleVideoCamera = useCallback(() => {
    setCurrentDeviceIndex((prev) => (prev + 1) % devices.length);
    getUserMedia();
  }, [devices.length, getUserMedia]);

  const callPeer = useCallback(
    (id) => {
      setReciever(id);
      const callerId = users.filter((getId) => getId !== id)[0];
      if (!yourID) {
        console.log("Socket not ready or yourID not set");
        return;
      }

      const peer = new Peer({
        initiator: true,
        trickle: false,
        config: iceServersConfig,
        stream: stream,
      });

      peer.on("signal", (data) => {
        socket.current.emit("callUser", {
          userToCall: id,
          signalData: data,
          from: callerId,
          chatId: chatId,
        });
      });

      peer.on("stream", (stream) => {
        setReceivedStream(stream);
      });

      socket.current.on("callAccepted", (data) => {
        setCallAccepted(true);
        setReceivingCall(true);
        peer.signal(data.signal);
      });
    },
    [users, yourID, stream, chatId]
  );

  const acceptCall = useCallback(() => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      config: iceServersConfig,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("acceptCall", {
        signal: data,
        from: caller,
        to: reciever,
        chatId: chatId,
      });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    if (callerSignal) {
      if (peer.destroyed) {
        console.log("Peer is destroyed, cannot signal.");
        return;
      }
      peer.signal(callerSignal);
    } else {
      console.log("Caller signal is missing");
    }

    connectionRef.current = peer;
  }, [callAccepted, caller, callerSignal, stream]);

  const leaveCall = useCallback(
    (id) => {
      if (
        connectionRef.current &&
        typeof connectionRef.current.destroy === "function"
      ) {
        connectionRef.current.destroy();
        connectionRef.current = null;
      }
      socket.current.emit("endCall", { chatId, to: id });
      setIsVideoOn(false);
      setIsAudioOn(false);
      setCallEnded(true);
      setCallAccepted(false);
      setReceivingCall(false);
      setIsVideoChatVisible(!isVideoChatVisible);
      router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/chat/${chatId}`);
    },
    [chatId, isVideoChatVisible, router]
  );

  useEffect(() => {
    getVideoDevices();
  }, []);

  useEffect(() => {
    if (!stream) {
      getUserMedia();
    }
  }, [getUserMedia, stream]);

  useEffect(() => {
    let isMounted = true;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (isMounted) {
          setStream(stream);
          if (userVideo.current && stream) {
            userVideo.current.srcObject = stream;
          }
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (callAccepted && receivedStream) {
      partnerVideo.current.srcObject = receivedStream;
    }
  }, [callAccepted, receivedStream]);

  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_SERVER_URL, {
      query: { userId: sessionId, chatId: chatId },
    });

    socket.current.on("yourID", (id) => {
      setYourID(id);
    });

    socket.current.on("allUsers", (users) => {
      setUsers(users);
    });

    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });

    socket.current.on("callEndedByPeer", (data) => {
      if (connectionRef.current && data.to) {
        connectionRef.current.destroy();
        connectionRef.current = null;
      }
      setIsVideoOn(false);
      setIsAudioOn(false);
      setCallEnded(true);
      setCallAccepted(false);
      setReceivingCall(false);
      setIsVideoChatVisible(!isVideoChatVisible);
      router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/chat/${chatId}`);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [sessionId, chatId]);

  useEffect(() => {
    if (!openedFromPush && users && reciever) {
      const id = users.filter((getId) => getId !== yourID)[0];
      const peer = new Peer({
        initiator: true,
        trickle: false,
        config: iceServersConfig,
        stream: stream,
      });

      peer.on("signal", (data) => {
        socket.current.emit("callUser", {
          userToCall: id,
          signalData: data,
          from: yourID,
          chatId: chatId,
        });
      });

      peer.on("stream", (stream) => {
        setReceivedStream(stream);
      });

      socket.current.on("callAccepted", (data) => {
        setCallAccepted(true);
        setReceivingCall(true);
        peer.signal(data.signal);
      });
    }
  }, [openedFromPush, users, reciever, yourID, stream, chatId]);

  return (
    <div className="absolute w-full h-full object-cover flex flex-col rounded-lg">
      <button
        id="noExpandDrag"
        title={expanded ? "Contract video" : "Expand video"}
        className="absolute z-[100] top-1 right-0 text-primary-orange h-[40px] py-2 px-4 rounded focus:outline-none focus:shadow-outline transform active:scale-95 transition duration-150 ease-in-out"
        onClick={expanded ? toggleExpanded : toggleContracted}
      >
        {expanded ? <BsArrowsAngleContract /> : <BsArrowsAngleExpand />}
      </button>
      {!callAccepted && (
        <button
          id="noDrag"
          title="Switch Camera"
          className="absolute z-[100] top-1 left-0 text-purple-600 h-[40px] py-2 px-4 rounded focus:outline-none focus:shadow-outline transform active:scale-95 transition duration-150 ease-in-out"
          onClick={toggleVideoCamera}
        >
          <MdOutlineCameraswitch className="w-6 h-6" />
        </button>
      )}
      <div className="flex w-full ">
        {stream && (
          <video
            id={isMainVideo ? "drag" : "noMainDrag"}
            onClick={toggleVideoImage}
            playsInline
            muted
            ref={userVideo}
            autoPlay
            className={`absolute rounded-lg ${
              isMainVideo
                ? "w-full h-full border-teal-600 z-10"
                : "w-[100px] h-[60px] top-2 left-2 border-emerald-600 z-20"
            } object-cover border-2`}
          />
        )}
        {callAccepted && !callEnded && (
          <video
            id={isMainVideo ? "userDrag" : "noMainUserDrag"}
            onClick={toggleVideoImage}
            playsInline
            ref={partnerVideo}
            autoPlay
            className={`absolute rounded-lg ${
              !isMainVideo
                ? "w-full h-full border-teal-600 z-10"
                : "w-[100px] h-[60px] top-2 left-2 border-emerald-600 z-20"
            } object-cover border-2`}
          />
        )}
      </div>
      <div
        id="noDrag"
        className="flex flex-col absolute bottom-0 w-full justify-center items-center gap-3 z-50"
      >
        {sessionId &&
          chatMembers &&
          !callAccepted &&
          !receivingCall &&
          !openedFromPush &&
          chatMembers
            .filter((item) => item._id !== sessionId)
            .map((item, index) => (
              <button
                key={`${index}+${item}`}
                title="Call"
                className="flex justify-center items-center w-[150px] h-[40px] text-[10px] gap-1 bg-teal-500/80 hover:bg-teal-700/80 text-white font-bold py-1 px-2 rounded  focus:outline-none focus:shadow-outline transform active:scale-95 transition duration-150 ease-in-out"
                onClick={() => callPeer(item._id)}
              >
                <VscCallOutgoing className="w-[20px] h-[20px]" />
                <p className="overflow-hidden">{item.username}</p>
              </button>
            ))}
        <div className="flex w-full justify-center ">
          {receivingCall && !callEnded && (
            <div className="flex gap-4">
              {!callAccepted && (
                <button
                  title="Accept call"
                  className={`bg-cyan-500/80 hover:bg-cyan-700/80 mb-3 ${button_style}`}
                  onClick={acceptCall}
                >
                  <PiPhoneCallThin className={icon_style} />
                </button>
              )}
              <div className="flex gap-4">
                <button
                  title="On/Off video"
                  className={`bg-blue-500/80 hover:bg-blue-700/80 ${button_style}`}
                  onClick={toggleVideo}
                >
                  {isVideoOn ? (
                    <FaVideo className={icon_style} />
                  ) : (
                    <FaVideoSlash className={icon_style} />
                  )}
                </button>
                <button
                  title="On/Off audio"
                  className={`bg-green-500/80 hover:bg-green-700/80 ${button_style}`}
                  onClick={toggleAudio}
                >
                  {isAudioOn ? (
                    <FaMicrophone className={icon_style} />
                  ) : (
                    <FaMicrophoneSlash className={icon_style} />
                  )}
                </button>
                <button
                  title="End call"
                  className={`bg-red-500/80 hover:bg-red-700/80 mb-3 ${button_style}`}
                  onClick={() => {
                    setReceivingCall(false);
                    leaveCall(users.filter((id) => id !== yourID)[0]);
                  }}
                >
                  <PiPhoneSlashThin className={icon_style} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(VideoApp);
