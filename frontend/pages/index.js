import { useEffect } from 'react';
import '../styles/Home.module.css'; // Import component-specific styles

export default function Home() {
    useEffect(() => {
        // Dynamically load the particles.js script
        const script = document.createElement('script');
        script.src = '/particles.js'; // Path relative to the 'public' folder
        script.async = true;

        script.onload = () => {
            // Ensure particlesJS is available globally
            if (window.particlesJS) {
                window.particlesJS.load('particles-js', '/particles-config.json', () => {
                    console.log('Particles.js config loaded');
                });
            } else {
                console.error('particlesJS is not available');
            }
        };

        document.body.appendChild(script);
    }, []);

    return (
        <div id="particles-js" className="container">
            <h1 className="title">hello.</h1>
        </div>
    );
}
