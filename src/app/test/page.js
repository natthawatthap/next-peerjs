"use client";

import { useEffect, useState, useRef } from "react";
export default function Test() {
  const videoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);

  const handleCamera = async () => {
    try {
      if (isCameraOn) {
        // Turn off the camera
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      } else {
        // Turn on the camera
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        videoRef.current.srcObject = stream;
      }

      // Toggle the camera status
      setIsCameraOn(!isCameraOn);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };
  const handleShareScreen = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      videoRef.current.srcObject = mediaStream;
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };

  const handleMicMuted = () => {
    const currentStream = videoRef.current.srcObject;

    if (currentStream) {
      const audioTracks = currentStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !isMicMuted;
      });

      setIsMicMuted(!isMicMuted);
    }
  };

  return (
    <div>
      <button onClick={handleCamera}>
        {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
      </button>
      <button onClick={handleMicMuted}>
        {isMicMuted ? "Unmute Mic" : "Mute Mic"}
      </button>
      <button onClick={handleShareScreen}>Share Screen</button>
      <video ref={videoRef} autoPlay playsInline muted={isMicMuted}></video>
    </div>
  );
}
