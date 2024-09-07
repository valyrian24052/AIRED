import React from 'react';
import styles from '../styles/MusicAnimation.module.css';

const MusicAnimation = ({ isPlaying, beatDetected }) => {
  const noteColor = beatDetected ? '#FF00FF' : '#40E0D0';

  return (
    <div className={styles.musicAnimation}>
      <div className={`${styles.note} ${styles.note1}`} style={{ color: noteColor }}>♪</div>
      <div className={`${styles.note} ${styles.note2}`} style={{ color: noteColor }}>♫</div>
      <div className={`${styles.note} ${styles.note3}`} style={{ color: noteColor }}>♩</div>
      <div className={`${styles.note} ${styles.note4}`} style={{ color: noteColor }}>♬</div>
    </div>
  );
};

export default MusicAnimation;