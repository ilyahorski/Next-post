import React, { useContext } from 'react';
import { VideoSocketContext } from '~/utils/context/VideoContext';

const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(VideoSocketContext);

  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <div className="flex justify-around">
          <h1>{call.name} is calling:</h1>
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={answerCall}
          >
            Answer
          </button>
        </div>
      )}
    </>
  );
};

export default Notifications;
