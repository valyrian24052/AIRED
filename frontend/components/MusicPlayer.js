import { useState, useEffect, useRef } from 'react';
import styles from '../styles/MusicPlayer.module.css';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const clickSoundRef = useRef(null);

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
          onReady: (event) => setPlayer(event.target),
        },
      });
    };

    clickSoundRef.current = new Audio('/click.wav');
  }, []);

  const togglePlay = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(!isPlaying);
      clickSoundRef.current.play();
    }
  };

  return (
    <button onClick={togglePlay} className={`${styles.musicPlayer} ${isPlaying ? styles.playing : ''}`}>
      <span className={styles.musicIcon}>{isPlaying ? '🎵' : '🎶'}</span>
      <span className={styles.musicText}>{isPlaying ? 'Pause' : 'Play'} Music</span>
      <div id="youtube-player"></div>
    </button>
  );
};

export default MusicPlayer;
