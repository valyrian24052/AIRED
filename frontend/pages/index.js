import { useEffect, useState, useRef } from 'react';
import styles from '../styles/Home.module.css'; 
import Logo from '../utils/logo.svg';
import Send from '../utils/sendbutton.svg';
import Head from 'next/head';
import DOMPurify from 'dompurify';
import MusicPlayer from '../components/MusicPlayer';
import Link from 'next/link';
import ConnectPopup from '../components/ConnectPopup';
import IntroText from '../components/IntroText';

export default function Home() {
    const [isActive, setIsActive] = useState(false); 
    const [userInput, setUserInput] = useState('');
    const [conversation, setConversation] = useState([]);
    const [loadingMessage, setLoadingMessage] = useState(''); 
    const conversationEndRef = useRef(null);
    const inputRef = useRef(null); 
    const clickSoundRef = useRef(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
    const pingMeButtonRef = useRef(null);

    const title = isActive ? 'Chatbot Mode' : 'Valyrian assistant mode';
    const clickableText1 = isActive ? 'Tell me a Joke' : 'key accomplishments';
    const clickableText2 = isActive ? 'Tell me a Bed time story' : 'Overview of his experiences';

    useEffect(() => {
        if (conversationEndRef.current) {
            conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        clickSoundRef.current = new Audio('/click.wav');
    }, []);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = '/particles.js'; 
        script.async = true;

        script.onload = () => {
            if (window.particlesJS) {
                window.particlesJS.load('particles-js', '/particles-config.json');
            }
        };

        script.onerror = () => console.error('Failed to load particles.js script');
        document.body.appendChild(script);
    }, []);

    const handleSend = async () => {
        if (userInput.trim() === '') return;
    
        const payload = { history: [...conversation], userInput };
        const newConversation = [...conversation, { type: 'user', text: userInput }];
        setConversation(newConversation);
        setUserInput('');
        setLoadingMessage('Loading .');

        let loadingInterval = setInterval(() => {
            setLoadingMessage(prev => (prev === 'Loading . . .' ? 'Loading .' : prev + ' .'));
        }, 500);
    
        try {
            const response = await fetch(isActive ? '/api/runpython' : '/api/assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            clearInterval(loadingInterval);
            setLoadingMessage('');

            if (response.ok) {
                setConversation(prev => [...prev, { type: 'assistant', text: data.response }]);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            clearInterval(loadingInterval);
            setLoadingMessage('');
            console.error('Failed to fetch response from API:', error);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') handleSend();
    };

    const handleTextClick = (text) => {
        setUserInput(text);
        inputRef.current.focus(); 
    };

    const toggleSwitch = () => {
        setIsActive(!isActive);
    };

    const openPopup = (e) => {
        e.preventDefault();
        const rect = pingMeButtonRef.current.getBoundingClientRect();
        setButtonPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        setIsPopupOpen(true);
    };

    return (
        
        <div id="particles-js" className={styles.container}>
            <MusicPlayer />
            <Head>
                <title>Valyrian's assistant</title>
                <link rel="icon" href="/title.svg" type="image/svg+xml" />
            </Head>
            <header className={styles.header}>
                <img 
                    src={Logo} 
                    alt="Logo" 
                    className={styles.logo} 
                    onClick={() => window.location.reload()} 
                    style={{ cursor: 'pointer' }}
                />
                <nav className={styles.nav}>
                    <a href="https://github.com/valyrian24052" className={styles.link}>Github</a>
                    <Link href="/resume" className={styles.link}>Resume</Link>
                    <a href="https://github.com/valyrian24052/Portfolio" className={styles.link}>Documents</a>
                    <button onClick={openPopup} ref={pingMeButtonRef} className={styles.pingMeButton}>
                        <span className={styles.icon}>📡</span> Ping Me
                    </button>
                </nav>
            </header>
            <main className={styles.main}>
                {conversation.length === 0 ? (
                    <>
                        <h1 className={styles.mainTitle}>Hi, I am AIRED</h1>
                        <p className={styles.subTitle}>{title}</p>
                        <div className={styles.chatContainer}>
                            <div className={styles.clickableText} onClick={() => handleTextClick(clickableText1)}>
                                {clickableText1}
                            </div>
                            <div className={styles.clickableText} onClick={() => handleTextClick(clickableText2)}>
                                {clickableText2}
                            </div>
                            <div className={styles.inputContainer}>
                                <input 
                                    ref={inputRef} // Assign the ref to input
                                    type="text" 
                                    className={styles.input} 
                                    placeholder="Type your response..." 
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyPress={handleKeyPress} 
                                />
                                <button className={styles.sendButton} onClick={handleSend}>
                                    <img src={Send} alt="Send" />
                                </button>
                            </div>
                            <div className={`${styles.toggleSwitchContainer} ${isActive ? styles.active : ''}`} onClick={toggleSwitch}>
                                <div className={`${styles.toggleSwitch} ${isActive ? styles.active : ''}`}></div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.conversationContainer}>
                            {conversation.map((item, index) => (
                                <div key={index} className={`${styles.conversationItem} ${item.type === 'user' ? styles.user : styles.assistant}`}>
                                    {item.type === 'assistant' ? (
                                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.text) }} />
                                    ) : (
                                        item.text
                                    )}
                                </div>
                            ))}
                            {loadingMessage && <div className={styles.loadingMessage}>{loadingMessage}</div>}
                            <div ref={conversationEndRef} />
                        </div>
                        <div className={styles.chatContainer}>
                            <div className={styles.clickableText} onClick={() => handleTextClick(clickableText1)}>
                                {clickableText1}
                            </div>
                            <div className={styles.clickableText} onClick={() => handleTextClick(clickableText2)}>
                                {clickableText2}
                            </div>
                            <div className={styles.inputContainer}>
                                <input 
                                    ref={inputRef} // Assign the ref to input
                                    type="text" 
                                    className={styles.input} 
                                    placeholder="Type your response..." 
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyPress={handleKeyPress} 
                                />
                                <button className={styles.sendButton} onClick={handleSend}>
                                    <img src={Send} alt="Send" />
                                </button>
                            </div>
                            <div className={`${styles.toggleSwitchContainer} ${isActive ? styles.active : ''}`} onClick={toggleSwitch}>
                                <div className={`${styles.toggleSwitch} ${isActive ? styles.active : ''}`}></div>
                            </div>
                        </div>
                    </>
                )}
            </main>
            <ConnectPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} buttonPosition={buttonPosition} />
            <IntroText />
        </div>
    );
}
