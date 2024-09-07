// pages/_app.js
import '../styles/global.css'; 
import '../styles/global.css';
import React from 'react';
import ClickSound from '../components/ClickSound';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ClickSound />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
