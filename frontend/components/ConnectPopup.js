import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/ConnectPopup.module.css';

const ConnectPopup = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const popupRef = useRef(null); // For getting the popup dimensions and position

  useEffect(() => {
    if (isOpen) {
      setIsActive(true);
    } else {
      const timer = setTimeout(() => setIsActive(false), 300); // Match this with the transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div className={`${styles.overlay} ${isActive ? styles.active : ''}`} onClick={onClose}>
      <div 
        ref={popupRef} 
        className={`${styles.popup} ${isActive ? styles.active : ''}`} 
        onClick={(e) => e.stopPropagation()}>
        <div className={styles.popupContent}>
          <h2 className={styles.title}>HI! Thanks for reaching out.</h2>
          <p className={styles.subtitle}>I'll get back to you shortly.</p>
          <p className={styles.message}>Drop a short message about your visit here.</p>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <input type="tel" placeholder="Your Phone Number" required /> {/* New phone number field */}
            <textarea placeholder="Your Message" required></textarea>
            <button type="submit" className={styles.submitButton}>Send</button>
          </form>
        </div>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default ConnectPopup;
