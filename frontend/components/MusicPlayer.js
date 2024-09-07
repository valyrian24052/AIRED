import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/MusicPlayer.module.css';
import MusicAnimation from './MusicAnimation';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const [beatDetected, setBeatDetected] = useState(false);
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      const newPlayer = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: 'jfKfPfyJRdk',
        playerVars: {
          autoplay: 0,
          controls: 0,
        },
        events: {
          onReady: (event) => {
            setPlayer(event.target);
            const videoUrl = event.target.getVideoUrl();
            audioRef.current.src = `https://www.youtube.com/audio?v=${videoUrl.split('v=')[1]}`;
          },
        },
      });
    };

    // Set up audio context and analyser
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    // Connect hidden audio element to analyser
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    audioRef.current = audio;

    return () => {
      audioContext.close();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
        audioRef.current.pause();
      } else {
        player.playVideo();
        audioRef.current.play();
        detectBeats();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const detectBeats = () => {
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const detectBeat = () => {
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      
      // You might need to adjust this threshold
      if (average > 100) {
        setBeatDetected(true);
        setTimeout(() => setBeatDetected(false), 100);
      }

      animationFrameRef.current = requestAnimationFrame(detectBeat);
    };

    detectBeat();
  };

  return (
    <div className={styles.musicPlayerContainer}>
      <div className={styles.animationWrapper}>
        <MusicAnimation isPlaying={isPlaying} beatDetected={beatDetected} />
      </div>
      <button onClick={togglePlay} className={`${styles.musicPlayer} ${isPlaying ? styles.playing : ''}`}>
        <span className={styles.musicIcon}>{isPlaying ? '🎵' : '🎶'}</span>
        <span className={styles.musicText}>{isPlaying ? 'Pause' : 'Play'} Music</span>
      </button>
      <div id="youtube-player"></div>
    </div>
  );
};

export default MusicPlayer;
