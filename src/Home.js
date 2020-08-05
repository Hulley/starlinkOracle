import React from 'react';
import './App.css';
import logo from './logo.svg';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          This react app will be attempting to provide a visualisation for starLink positions
        </p>
        <a
          className="App-link"
          href="/three-view"
          rel="noopener noreferrer"
        >
          Three
        </a>
      </header>
    </div>
  );
}

export default Home;
