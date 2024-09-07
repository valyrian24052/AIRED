import React, { useState, useEffect } from 'react';
import styles from '../styles/ConnectPopup.module.css';

const ConnectPopup = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsActive(true);
    } else {
      const timer = setTimeout(() => setIsActive(false), 300); // Match this with the transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });
      
      if (response.ok) {
        alert('Message sent successfully!');
        onClose();
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (!isOpen && !isActive) return null;

  return (
    <div className={`${styles.overlay} ${isActive ? styles.active : ''}`} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.popupContent}>
          <h2 className={styles.title}>HI! Thanks for reaching out.</h2>
          <p className={styles.subtitle}>I'll get back to you shortly.</p>
          <p className={styles.message}>Drop a short message about your visit here.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
            <button type="submit" className={styles.submitButton}>Send</button>
          </form>
        </div>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default ConnectPopup;