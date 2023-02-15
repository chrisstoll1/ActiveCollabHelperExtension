import React from 'react';
import ReactDOM from 'react-dom/client';
import WebFont from 'webfontloader';

import "./assets/css/theme.css";
import "./assets/css/custom.css";

import Main from './layouts/Main';
import BackgroundParticles from './components/Background/BackgroundParticles';

WebFont.load({google:{families:['Material Icons', 'Gothic A1']}});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BackgroundParticles/>
    <Main/>
  </React.StrictMode>
);