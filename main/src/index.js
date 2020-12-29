import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import comms from './comms';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ViewManager from './ViewManager';

const { ipcRenderer } = window;
comms.init(ipcRenderer);

ReactDOM.render(
  <React.StrictMode>
    <ViewManager />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
