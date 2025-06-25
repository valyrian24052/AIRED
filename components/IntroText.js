import React from 'react';
import styles from '../styles/IntroText.module.css';

const IntroText = () => {
  return (
    <div className={styles.introContainer}>
      <div className={styles.introContent}>
        <p className={styles.introText}>
          Hey there, I'm <strong>Shashank</strong>!<br/>
          If you're here, I must've caught your eye – <strong>thanks for stopping by</strong>!<br/><br/>
          Feel free to explore, chat with my assistant, or switch modes by toggling the button.<br/><br/>
          Oh, and if you need a <strong>vibe boost</strong>, hit the music player in the bottom right corner.<br/><br/>
          Think I'm cool? <strong>Drop me a message</strong>!<br/>
          Have an <strong>awesome day</strong>!
        </p>
      </div>
    </div>
  );
};

export default IntroText;