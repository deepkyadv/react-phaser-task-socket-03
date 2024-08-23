import React, { useRef, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import io from 'socket.io-client';
import Game from './components/Game';
import './App.css';

const socket = io('http://localhost:3001');

const currentUserRole = 'user'; // Change this to 'admin' for admin access

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Viewer />} />
        <Route path="/admin" element={currentUserRole === 'admin' ? <Admin /> :<Admin />} />
      </Routes>
    </Router>
  );
}

function Viewer() {
  const [clickedButton, setClickedButton] = useState(null);

  useEffect(() => {
    // Listen for updates from the server
    socket.on('updateMove', (direction) => {
      setClickedButton(direction);
    });

    // Clean up the event listener when component unmounts
    return () => {
      socket.off('updateMove');
    };
  }, []);

  return (
    <div className="app-container">
      <h1>Current Admin Move: {clickedButton || 'None'}</h1>
      <Game readOnly={true} />
    </div>
  );
}

function Admin() {
  const gameRef = useRef(null);
  const [clickedButton, setClickedButton] = useState(null);

  const handleButtonClick = (direction) => {
    setClickedButton(direction);
    socket.emit('moveBall', direction); // Send the move to the server
    gameRef.current.moveBall(direction);
  };

  useEffect(() => {
    // Listen for updates from the server
    socket.on('updateMove', (direction) => {
      setClickedButton(direction);
    });

    // Clean up the event listener when component unmounts
    return () => {
      socket.off('updateMove');
    };
  }, []);

  return (
    <div className="app-container">
      <h1>Current Move: {clickedButton || 'None'}</h1>
      <div className="button-container top">
        <button onClick={() => handleButtonClick('up1')}>Button 1 (Up)</button>
        <button onClick={() => handleButtonClick('up2')}>Button 2 (Up)</button>
      </div>
      <div className="middle-container">
        <div className="button-container left">
          <button onClick={() => handleButtonClick('left1')}>Button 1 (Left)</button>
          <button onClick={() => handleButtonClick('left2')}>Button 2 (Left)</button>
        </div>
        <div className="game-container">
          <Game ref={gameRef} />
        </div>
        <div className="button-container right">
          <button onClick={() => handleButtonClick('right1')}>Button 1 (Right)</button>
          <button onClick={() => handleButtonClick('right2')}>Button 2 (Right)</button>
        </div>
      </div>
      <div className="button-container bottom">
        <button onClick={() => handleButtonClick('down1')}>Button 1 (Down)</button>
        <button onClick={() => handleButtonClick('down2')}>Button 2 (Down)</button>
      </div>
    </div>
  );
}

export default App;
