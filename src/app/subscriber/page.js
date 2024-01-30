"use client";

import { useEffect, useState, useRef } from "react";
import { Peer } from "peerjs";
export default function Subscriber() {
  const [peer, setPeer] = useState(
    new Peer(
      undefined
      //   {
      //   host: "localhost",
      //   port: 9000,
      //   path: "/peerjs",
      // }
    )
  );
  const [myPeerId, setMyPeerId] = useState("");
  const [peerId, setPeerId] = useState("");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const videoRef = useRef(null);
  useEffect(() => {
    peer.on("open", (id) => {
      console.log("My peer ID is: " + id);
      setMyPeerId(id);
    });

    peer.on("connection", (conn) => {
      console.log(conn.peer);
      conn.on("data", (data) => {
        console.log(data);
        setMessages((prevMessages) => [...prevMessages, data]);
      });
    });
    return () => {
      peer.disconnect();
    };
  }, []);

  const handleConnect = () => {
    console.log("Connect to peer ID:", peerId);
    peer.connect(peerId);
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
    getUserMedia(
      { video: true, audio: true },
      (stream) => {
        let call = peer.call(peerId, stream);
        call.on("stream", (remoteStream) => {
          console.log(remoteStream);
          videoRef.current.srcObject = remoteStream;
        });
      },
      (err) => {
        console.log("Failed to get local stream", err);
      }
    );
  };

  const handleDisconnect = () => {
    console.log("Disconnect to peer ID:", peerId);
    peer.destroy();
  };

  const sendMessage = () => {
    const conn = peer.connect(peerId);
    const messageData = {
      peerId: myPeerId,
      timestamp: new Date().toISOString(),
      message: newMessage,
    };
    conn.on("open", () => {
      conn.send(messageData);
    });
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setNewMessage("");
  };

  return (
    <main>
      <div>
        <p>Peer ID: {myPeerId}</p>
      </div>

      <div>
        <label>Connection: </label>
        <input
          type="text"
          value={peerId}
          onChange={(e) => setPeerId(e.target.value)}
        />
        <button onClick={handleConnect}>Connect</button>
        <button onClick={handleDisconnect}>Disconnect</button>
      </div>

      <div>
        <video ref={videoRef} autoPlay muted playsInline />
      </div>

      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <p>
              <strong>Peer ID:</strong> {message.peerId}
              <br />
              {new Date(message.timestamp).toLocaleTimeString()}
              <br />
              <strong>Message:</strong> {message.message}
            </p>
          </div>
        ))}
      </div>

      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </main>
  );
}
