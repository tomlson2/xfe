import React, { useEffect, useState } from 'react';
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:5000"; // replace this with your Flask app's URL

function GameComponent() {
  const [socket, setSocket] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [twitterHandle, setTwitterHandle] = useState("");
  const [address, setAddress] = useState("");
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const newSocket = socketIOClient(ENDPOINT);
    setSocket(newSocket);

    newSocket.on('countdown', data => {
      setCountdown(data.time);
    });

    newSocket.on('new_entry', data => {
      setEntries(prevEntries => [...prevEntries, data]);
    });

    newSocket.emit('get_entries');

    // cleanup the effect
    return () => newSocket.disconnect();
  }, []);

  const startGame = () => {
    if (socket) socket.emit('start_game');
  };

  const submitEntry = () => {
    if (socket) socket.emit('submit_entry', { twitterHandle, address });
  };

  return (
    <div>
      <button onClick={startGame}>Start Game</button>
      <p>Time left: {countdown}</p>

      <input type="text" placeholder="Twitter handle" value={twitterHandle} onChange={e => setTwitterHandle(e.target.value)} />
      <input type="text" placeholder="Wallet address" value={address} onChange={e => setAddress(e.target.value)} />
      <button onClick={submitEntry}>Submit Entry</button>

      <h2>Entries:</h2>
      <ul>
        {entries.map((entry, index) => (
          <li key={index}>
            {entry.twitter_handle}, {entry.address}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GameComponent;
