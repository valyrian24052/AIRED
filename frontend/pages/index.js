import { useEffect } from 'react';
import styles from '../styles/Home.module.css'; 
import Logo from '../utils/logo.svg';
import Send from '../utils/sendbutton.svg';

export default function Home() {
    useEffect(() => {
        console.log('useEffect triggered');

        const script = document.createElement('script');
        script.src = '/particles.js'; 
        script.async = true;

        script.onload = () => {
            console.log('Particles.js script loaded');
            if (window.particlesJS) {
                console.log('particlesJS is available');
                window.particlesJS.load('particles-js', '/particles-config.json', () => {
                    console.log('Particles.js config loaded');
                });
            } else {
                console.error('particlesJS is not available');
            }
        };

        script.onerror = () => {
            console.error('Failed to load particles.js script');
        };

        document.body.appendChild(script);
        console.log('Script appended to body');
    }, []);

    return (
        <div id="particles-js" className={styles.container}>
            <header className={styles.header}>
                <img src={Logo} alt="Logo" className={styles.logo} />
                <nav className={styles.nav}>
                    <a href="https://github.com/valyrian24052" className={styles.link}>Github</a>
                    <a href="mailto:shashanksharma.1214@gmail.com" className={styles.link}>Connect</a>
                </nav>
            </header>
            <main className={styles.main}>
                <h1 className={styles.mainTitle}>Hi, I am AIRED</h1>
                <p className={styles.subTitle}>How can I assist you</p>
                <div className={styles.chatContainer}>
                    <div className={styles.inputContainer}>
                        <input type="text" className={styles.input} placeholder="Type your response..." />
                        <button className={styles.sendButton}>
                            <img src={Send} alt="Send" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
