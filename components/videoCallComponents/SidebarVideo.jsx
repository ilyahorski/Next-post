import React, { useState, useContext } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { VideoSocketContext } from '~/utils/context/VideoContext';

const SidebarVideo = ({ children }) => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(VideoSocketContext);
  const [idToCall, setIdToCall] = useState('');

  return (
    <div className="container mx-auto w-600 my-8 p-0 sm:w-4/5">
      <div className="glassmorphism">
        <form className="flex flex-col" noValidate autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-5">
              <h6 className="text-lg mb-2">Account Info</h6>
              <input 
                className="form_input"
                placeholder="Name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
              <CopyToClipboard text={me}>
                <div 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full my-4 cursor-pointer">
                  Copy Your ID
                </div>
              </CopyToClipboard>
            </div>
            <div className="p-5">
              <h6 className="text-lg mb-2">Make a call</h6>
              <input 
                className="form_input"
                placeholder="ID to call" 
                value={idToCall} 
                onChange={(e) => setIdToCall(e.target.value)} 
              />
              {callAccepted && !callEnded ? (
                <div 
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full my-4 cursor-pointer"
                  onClick={leaveCall}
                >
                  Hang Up
                </div>
              ) : (
                <div 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full my-4 cursor-pointer"
                  onClick={() => callUser(idToCall)}
                >
                  Call
                </div>
              )}
            </div>
          </div>
        </form>
        {children}
      </div>
    </div>
  );
};

export default SidebarVideo;
