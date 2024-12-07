"use client"

import { useEffect, useRef, useState } from 'react';

const useServiceWorker = () => {
  const audioContextRef = useRef(null);
  const audioBufferRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const [isAudioAllowed, setIsAudioAllowed] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator  && 'PushManager' in window) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  useEffect(() => {
    // Check if audio is already allowed
    const audioAllowed = localStorage.getItem('audioAllowed') === 'true';
    setIsAudioAllowed(audioAllowed);

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  useEffect(() => {
    // Create AudioContext only if audio is allowed
    if (isAudioAllowed) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current.resume().then(() => {
        loadAudio();
      });
    }

    const channel = new BroadcastChannel('sw-messages');
    
    const handleServiceWorkerMessage = (event) => {
      const { type } = event.data;

      if (type === 'INCOMING_CALL' && isAudioAllowed) {
        playRingtone();
      } else if (type === 'CALL_ENDED') {
        stopRingtone();
      }
    };

    channel.addEventListener('message', handleServiceWorkerMessage);

    return () => {
      channel.removeEventListener('message', handleServiceWorkerMessage);
      channel.close();
      stopRingtone();
    };
  }, [isAudioAllowed]);

  const loadAudio = () => {
    fetch('/assets/call.mp3')
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContextRef.current.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        audioBufferRef.current = audioBuffer;
      })
      .catch(error => console.error('Error loading audio:', error));
  };

  let isRingtonePlaying = false;

  const playRingtone = () => {
    if (!isRingtonePlaying && audioContextRef.current && audioBufferRef.current) {
      sourceNodeRef.current = audioContextRef.current.createBufferSource();
      sourceNodeRef.current.buffer = audioBufferRef.current;
      sourceNodeRef.current.loop = true;
      sourceNodeRef.current.connect(audioContextRef.current.destination);
      sourceNodeRef.current.start();
      isRingtonePlaying = true;
    }
  };
  
  const stopRingtone = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      isRingtonePlaying = false;
    }
  };  

  const allowAudio = () => {
    if (isAudioAllowed) {
      setIsAudioAllowed(false);
      localStorage.removeItem('audioAllowed');
      return;
    }
    setIsAudioAllowed(true);
    localStorage.setItem('audioAllowed', 'true');
  };

  return { isAudioAllowed, allowAudio };
};

export default useServiceWorker;
