"use client";

import { useState, useRef, useEffect } from "react";
import { BiVideo, BiRotateLeft } from "react-icons/bi";
import { useMobileCheck } from "~/utils/hooks/useMobileCheck";

const VideoRecorder = ({
  onRecordingStart,
  onRecordingStop,
  showMediaButtons,
  setShowMediaButtons,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const mediaRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);
  const videoPreviewRef = useRef(null);

  const isMobile = useMobileCheck();

  useEffect(() => {
    if (isRecording && videoPreviewRef.current && stream) {
      videoPreviewRef.current.srcObject = stream;
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream, isRecording]);

  const startRecording = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: true,
      });
      setStream(newStream);

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = newStream;
      }

      mediaRecorderRef.current = new MediaRecorder(newStream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, {
          type: "video/mp4",
        });
        onRecordingStop(videoBlob);
        videoChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      onRecordingStart();
    } catch (error) {
      console.error("Error starting video recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      setStream(null);
    }
    setShowMediaButtons(!showMediaButtons);
  };

  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
    if (isRecording) {
      stopRecording();
      startRecording();
    }
  };

  const handleMouseDown = () => {
    startRecording();
  };

  const handleMouseUp = () => {
    stopRecording();
  };

  return (
    <>
      {isRecording && (
        <div
          style={{ top: "140px" }}
          className="flex items-center justify-center fixed right-[calc(50vw-100px)] bg-black bg-opacity-75 w-52 h-52 rounded-lg overflow-hidden z-5000"
        >
          <video
            ref={videoPreviewRef}
            className="w-48 h-48 rounded-full object-cover"
            autoPlay
            playsInline
            muted
          />
          {isMobile && (
            <button
              type="button"
              onClick={switchCamera}
              className="flex items-center justify-center w-7 h-7 absolute bottom-2 left-2 bg-gray-800 text-white rounded-full"
            >
              <BiRotateLeft className="inline-block w-5 h-5" />
            </button>
          )}
        </div>
      )}
      <div className="relative">
        <button
          type="button"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          onTouchCancel={handleMouseUp}
          className={`flex items-center justify-center w-10 h-10 ${
            isRecording ? "bg-red-500" : ""
          }`}
        >
          <BiVideo className="w-6 h-6 text-primary-300" />
        </button>
      </div>
    </>
  );
};

export default VideoRecorder;
