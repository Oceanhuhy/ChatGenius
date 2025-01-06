import React, { useState, useEffect } from 'react';
import { Bubble } from '@ant-design/x';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

function App() {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    axios.get('/api/time')
        .then(res => {
          setCurrentTime(res.data.time);
        });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>THE CURRENT TIME IS {currentTime}.</p>

        <Bubble content="Hello world!" />
      </header>
    </div>
  );
}

export default App;
