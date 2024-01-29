"use client";

import { useEffect, useState } from "react";
import { Peer } from "peerjs";
export default function Streamer() {
  const [peer, setPeer] = useState(new Peer());
  const [peerId, setPeerId] = useState("");
  const [connections, setConnections] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    peer.on("open", (id) => {
      console.log("My peer ID is: " + id);
      setPeerId(id);
    });

    peer.on("connection", (conn) => {
      //console.log(conn.peer);

      conn.on("data", (data) => {
        console.log(data);
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      conn.on("open", () => {
        console.log(connections);
        if (!connections.includes(conn.peer)) {
          console.log(conn.peer, "connected");
          setConnections((prevConnections) => [...prevConnections, conn.peer]);
        }
      });

      conn.on("close", () => {
        console.log(conn.peer);
        setConnections((prevConnections) =>
          prevConnections.filter((connection) => connection !== conn.peer)
        );
      });
    });

    return () => {
      peer.disconnect();
    };
  }, []);

  const sendMessage = () => {
    const messageData = {
      peerId: peerId,
      timestamp: new Date().toISOString(),
      message: newMessage,
    };
    connections.forEach((connection) => {
      const conn = peer.connect(connection);
      conn.on("open", () => {
        conn.send(messageData);
      });
    });
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setNewMessage("");
  };

  return (
    <main>
      <div>
        <p>Peer ID: {peerId}</p>
      </div>

      <div>
        <p>Connections</p>
        <ul>
          {connections.map((connection, index) => (
            <li key={index}>{connection}</li>
          ))}
        </ul>
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
