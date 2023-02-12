import React from 'react';
import ReactDOM from 'react-dom/client';
import WebFont from 'webfontloader';
import reportWebVitals from './reportWebVitals';
import MainContainer from './MainContainer';

WebFont.load({google:{families:['Material Icons', 'Gothic A1']}});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainContainer/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
