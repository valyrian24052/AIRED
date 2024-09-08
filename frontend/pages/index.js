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
import ResumeOverlay from '../components/ResumeOverlay';

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
    const [scrollKey, setScrollKey] = useState(0);
    const pingMeButtonRef = useRef(null);
    const [isResumeOpen, setIsResumeOpen] = useState(false);

    const title = isActive ? 'Chatbot Mode' : 'Valyrian assistant mode';
    const clickableText1 = isActive ? 'Tell me a Joke' : 'Key accomplishments';
    const clickableText2 = isActive ? 'Tell me a Bed time story' : 'Overview of experiences';
    
    useEffect(() => {
        if (conversationEndRef.current) {
            requestAnimationFrame(() => {
                conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }, [scrollKey]); 


    useEffect(() => {
        if (clickSoundRef.current === null) {
            clickSoundRef.current = new Audio('/click.wav'); 
        }
    }, []); 
    
    useEffect(() => {
        let interval;
        if (loadingMessage) {
            let dots = 0;
            interval = setInterval(() => {
                dots = (dots + 1) % 4;
                setLoadingMessage(`Loading${'.'.repeat(dots)}`);
            }, 500);
        }
        return () => clearInterval(interval);
    }, [loadingMessage]);

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

        const newUserMessage = { type: 'user', text: userInput };
        setConversation(prev => [...prev, newUserMessage]);
        const currentInput = userInput;
        setUserInput('');

        setLoadingMessage('Loading'); // Set loading message

        const apiEndpoint = isActive ? '/api/runpython' : '/api/assistant';

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userInput: currentInput, history: conversation }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
            }

            const data = await response.json();
            if (!data.content) {
                throw new Error('Response does not contain expected content');
            }

            const formattedResponse = data.content;

            setConversation(prev => [...prev, { type: 'assistant', text: '' }]); // Add an empty assistant message to start streaming
            setLoadingMessage(''); // Clear loading message

            const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
            const streamDelay = () => Math.random() * 5; // Random delay between 0ms and 10ms

            let displayedResponse = '';
            for (let char of formattedResponse) {
                displayedResponse += char;
                await delay(streamDelay());
                setConversation(prev => [
                    ...prev.slice(0, -1),
                    { type: 'assistant', text: displayedResponse }
                ]);

                // Trigger re-render by updating scrollKey
                setScrollKey(prevKey => prevKey + 1);
            }

        } catch (error) {
            console.error('Failed to fetch response from API:', error);
            let errorMessage = `An error occurred while processing your request: ${error.message}`;
            
            if (error.message.includes('429')) {
                errorMessage = "Too many frequent requests. Let me rest a bit :)";
            }
            
            setConversation(prev => [...prev, { type: 'assistant', text: errorMessage }]);
            setLoadingMessage(''); // Clear loading message
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
                    <button onClick={() => setIsResumeOpen(true)} className={styles.link}>Journey</button>
                    <a href="https://github.com/valyrian24052" className={styles.link}>Github</a>
                    <a href="https://www.linkedin.com/in/shashanksharma1214/" className={styles.link}>LinkedIn</a>
                    <a href="https://github.com/valyrian24052/Portfolio" className={styles.link}>Docs</a>
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
                                    ref={inputRef} 
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
                                    ref={inputRef} 
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
            <ConnectPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
            <IntroText />
            <ResumeOverlay isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
        </div>
    );
}
