"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import WavesurferPlayer from "@wavesurfer/react";
import { BiPlay, BiPause } from "react-icons/bi";
import { useMobileCheck } from "~/utils/hooks/useMobileCheck";

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
}

const AudioMessageDisplay = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [wavesurferObj, setWavesurferObj] = useState(null);
  const isMobile = useMobileCheck();
  const rafId = useRef(null);

  const onReady = useCallback((wavesurfer) => {
    setWavesurferObj(wavesurfer);
    setDuration(wavesurfer.getDuration());
  }, []);

  const onPlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const onPause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const updateTime = useCallback(() => {
    if (wavesurferObj && wavesurferObj.isPlaying()) {
      setCurrentTime(wavesurferObj.getCurrentTime());
      rafId.current = requestAnimationFrame(updateTime);
    }
  }, [wavesurferObj]);

  const togglePlayPause = useCallback(() => {
    if (wavesurferObj) {
      wavesurferObj.playPause();
    }
  }, [wavesurferObj]);

  useEffect(() => {
    if (isPlaying) {
      rafId.current = requestAnimationFrame(updateTime);
    } else {
      cancelAnimationFrame(rafId.current);
    }

    return () => {
      cancelAnimationFrame(rafId.current);
    };
  }, [isPlaying, updateTime]);

  useEffect(() => {
    return () => {
      if (wavesurferObj) {
        wavesurferObj.destroy();
      }
    };
  }, [wavesurferObj]);

  return (
    <div className="flex flex-col min-w-[220px]">
      <div
        className={`${
          isMobile ? "max-w-[200px]" : "min-w-[200px]"
        } flex flex-row-reverse -mt-2`}
      >
        <div className="mr-2 w-10/12">
          <WavesurferPlayer
            waveColor={"#39988a"}
            progressColor={"#389869"}
            cursorColor={"navy"}
            barWidth={2}
            barRadius={3}
            barGap={1}
            responsive={true}
            height={40}
            normalize={true}
            partialRender={true}
            minPxPerSec={1}
            url={audioUrl}
            onReady={onReady}
            onPlay={onPlay}
            onPause={onPause}
          />
        </div>
        <button
          onClick={togglePlayPause}
          className="flex items-center justify-center w-2/12"
        >
          {isPlaying ? (
            <BiPause className="w-6 h-6" />
          ) : (
            <BiPlay className="w-6 h-6" />
          )}
        </button>
      </div>
      <div
        className={`${
          isMobile ? "max-w-[200px]" : "min-w-[200px]"
        } flex justify-between mt-1 text-sm text-gray-600`}
      >
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default AudioMessageDisplay;
