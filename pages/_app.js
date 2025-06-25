// pages/_app.js
import '../styles/global.css'; 
import '../styles/global.css';
import React from 'react';
import { useEffect } from 'react';
import ClickSound from '../components/ClickSound';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = 'hidden';

    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      <ClickSound />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
