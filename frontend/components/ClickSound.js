import React, { useEffect, useRef } from 'react';

const ClickSound = () => {
  const audioContextRef = useRef(null);
  const bufferRef = useRef(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    fetch('/click.wav')
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContextRef.current.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        bufferRef.current = audioBuffer;
      })
      .catch(error => console.error('Error loading audio file:', error));

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const playSound = () => {
      if (audioContextRef.current && bufferRef.current) {
        const source = audioContextRef.current.createBufferSource();
        source.buffer = bufferRef.current;
        source.connect(audioContextRef.current.destination);
        source.start(0);
      }
    };

    document.addEventListener('click', playSound);

    return () => {
      document.removeEventListener('click', playSound);
    };
  }, []);

  return null; 
};

export default ClickSound;