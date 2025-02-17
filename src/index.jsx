// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './styles/custom.css'; // Archivo CSS global

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
