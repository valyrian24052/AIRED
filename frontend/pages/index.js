import { useEffect, useState, useRef } from 'react';
import styles from '../styles/Home.module.css'; 
import Logo from '../utils/logo.svg';
import Send from '../utils/sendbutton.svg';
import Head from 'next/head';

export default function Home() {
    const [isActive, setIsActive] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [conversation, setConversation] = useState([]);
    
    
    const conversationEndRef = useRef(null);

    useEffect(() => {
        if (conversationEndRef.current) {
            conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversation]);

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

    const handleSend = async () => {
        if (userInput.trim() === '') return;
    
        const payload = {
            history: [...conversation],
            userInput: userInput    
        };
    
        const newConversation = [...conversation, { type: 'user', text: userInput }];
    
        setConversation(newConversation);
        setUserInput('');
    
        try {
            let response;
            if (isActive) {
                // Send request to assistant
                response = await fetch('/api/assistant', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
            } else {
                // Send request to runpython
                response = await fetch('/api/runpython', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
            }
    
            const data = await response.json();
            if (response.ok) {
                setConversation(prev => [...prev, { type: 'assistant', text: data.response }]);
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error('Failed to fetch response from API:', error);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    };

    const handleTextClick = (text) => {
        setUserInput(text);
    };

    const title = isActive ? 'Valyrian assistant mode':'Chatbot Mode';

    const toggleSwitch = () => {
        setIsActive(!isActive);
        
    };

    return (
        <div id="particles-js" className={styles.container}>
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
                    <a href="https://github.com/valyrian24052/Portfolio" className={styles.link}>Documents</a>
                    <a href="mailto:shashanksharma.1214@gmail.com" className={styles.link}>Connect</a>
                </nav>
            </header>
            <main className={styles.main}>
                {conversation.length === 0 ? (
                    <>
                        <h1 className={styles.mainTitle}>Hi, I am AIRED</h1>
                        <p className={styles.subTitle}>{title}</p>
                        <div className={styles.chatContainer}>
                        <div 
                            className={styles.clickableText} 
                            onClick={() => handleTextClick(isActive ? 'List me Shashank\'s experiences' : 'Tell me a Joke')}
                        >
                            {isActive ? 'List me Shashank\'s experiences' : 'Tell me a Joke'}
                        </div>
                        <div 
                            className={styles.clickableText} 
                            onClick={() => handleTextClick(isActive ? 'List me tech stacks Shashank is proficient in' : 'Tell me a Bed time story')}
                        >
                            {isActive ? 'List me tech stacks Shashank is proficient in' : 'Tell me a Bed time story'}
                        </div>
                            <div className={styles.inputContainer}>
                                <input 
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
                            <div 
                                className={`${styles.toggleSwitchContainer} ${isActive ? styles.active : ''}`} 
                                onClick={toggleSwitch}>
                                <div className={`${styles.toggleSwitch} ${isActive ? styles.active : ''}`}>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.conversationContainer}>
                            {conversation.map((item, index) => (
                                <div 
                                    key={index} 
                                    className={`${styles.conversationItem} ${item.type === 'user' ? styles.user : styles.assistant}`}
                                >
                                    {item.text}
                                </div>
                            ))}
                            {/* Ref to ensure scrolling to the last message */}
                            <div ref={conversationEndRef} />
                        </div>
                        <div className={styles.chatContainer}>
                        <div 
                            className={styles.clickableText} 
                            onClick={() => handleTextClick(isActive ? 'List me Shashank\'s experiences' : 'Tell me a Joke')}
                        >
                            {isActive ? 'List me Shashank\'s experiences' : 'Tell me a Joke'}
                        </div>
                        <div 
                            className={styles.clickableText} 
                            onClick={() => handleTextClick(isActive ? 'List me tech stacks Shashank is proficient in' : 'Tell me a Bed time story')}
                        >
                            {isActive ? 'List me tech stacks Shashank is proficient in' : 'Tell me a Bed time story'}
                        </div>
                            <div className={styles.inputContainer}>
                                <input 
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
                            <div 
                                className={`${styles.toggleSwitchContainer} ${isActive ? styles.active : ''}`} 
                                onClick={toggleSwitch}>
                                <div className={`${styles.toggleSwitch} ${isActive ? styles.active : ''}`}>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
