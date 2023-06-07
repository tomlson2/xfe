import React, { useEffect, useState } from 'react';
import socketIOClient from "socket.io-client";
import './GameComponent.css';

const ENDPOINT = "https://xonbtcapi.azurewebsites.net/"; // replace this with your Flask app's URL

function GameComponent() {
  const [socket, setSocket] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [twitterHandle, setTwitterHandle] = useState("");
  const [address, setAddress] = useState("");
  const [entries, setEntries] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [winner, setWinner] = useState(null);
  const [lastWinner, setLastWinner] = useState(null);

  const fetchLastWinner = async () => {
    try {
      const response = await fetch(`${ENDPOINT}/last-winner`);
      if (response.ok) {
        const data = await response.json();
        setLastWinner(data);
      } else {
        console.log("Error: " + response.status);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  }

  useEffect(() => {
    const newSocket = socketIOClient(ENDPOINT);
    setSocket(newSocket);

    newSocket.on('game_over', data => {
      setGameStarted(false);
      setWinner(data.winner);
      setShowWinnerModal(true);
    });

    newSocket.on('countdown', data => {
      setCountdown(data.time);
    });

    newSocket.on('new_entry', data => {
      setEntries(prevEntries => [data, ...prevEntries]);
    });

    newSocket.on('game_status', data => {
      setGameStarted(data.gameStarted);
      setCountdown(data.time);
    });

    newSocket.on('countdown', data => {
      setCountdown(data.time);
    });
    newSocket.on('duplicate_entry', data => {
      setDuplicate(true);
    });
    newSocket.on('entries', data => {
      setEntries(data.entries);
    });

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (!gameStarted) {
      fetchLastWinner();
    }
  }, [gameStarted]);

  const submitEntry = () => {
    const duplicate = entries.find(entry => entry.twitter_handle === twitterHandle || entry.address === address);
    if (!duplicate) {
      socket.emit('submit_entry', { twitter_handle: twitterHandle, address: address });
    } else {
      // Show duplicate entry error
      console.log("Duplicate entry!");
    }
  };

  const startGame = () => {
    if (socket) socket.emit('start_game');
  };

  return (
    <div className="game">
      <h1>X-List Raffle</h1>
      <button style={{display: 'none'}} onClick={startGame}>Start Game</button>
      {gameStarted ? (
        <>
          <h3>Time left: {countdown}</h3>
          <input type="text" placeholder="Twitter handle" className="searchInputs" value={twitterHandle} onChange={e => setTwitterHandle(e.target.value)} />
          <br />
          <input type="text" placeholder="Wallet address" className="searchInputs" value={address} onChange={e => setAddress(e.target.value)} />
          <button onClick={submitEntry}>Submit Entry</button>
          {duplicate && <p>Wallet/Twitter handle already submitted</p>}
          <div>
            <table>
              <thead>
                <tr>
                  <th><h3>Twitter Handle</h3></th>
                  <th><h3>Wallet Address</h3></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.twitter_handle}</td>
                    <td>{entry.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div>
          {lastWinner &&
            <div>
              <h3>Last Winner</h3>
              <p>Twitter Handle: {lastWinner.twitter_handle}</p>
              <p>Wallet Address: {lastWinner.address}</p>
            </div>
          }
        </div>
      )}
    </div>
  );
}

export default GameComponent;
