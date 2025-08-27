
import React, { useState, useEffect } from 'react';

const LOADING_MESSAGES = [
    "Warming up the AI's creative circuits...",
    "Teaching pixels about perspective...",
    "Adjusting the virtual lighting...",
    "Finding the perfect spot for your product...",
    "Applying a dash of digital magic...",
    "This is taking a bit longer than usual, thanks for your patience!",
];

const Loader: React.FC = () => {
    const [message, setMessage] = useState(LOADING_MESSAGES[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(prevMessage => {
                const currentIndex = LOADING_MESSAGES.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % (LOADING_MESSAGES.length - 1); // Exclude the last message from random rotation
                return LOADING_MESSAGES[nextIndex];
            });
        }, 3000);

        // Switch to the 'patience' message after a longer delay
        const patienceTimeout = setTimeout(() => {
            clearInterval(interval);
            setMessage(LOADING_MESSAGES[LOADING_MESSAGES.length - 1]);
        }, 15000);

        return () => {
            clearInterval(interval);
            clearTimeout(patienceTimeout);
        };
    }, []);


    return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-100 rounded-xl">
            <div className="text-6xl animate-bounce-slow">🎨</div>
            <p className="mt-4 text-lg font-semibold text-indigo-600">Generating Mockups</p>
            <p className="mt-2 text-slate-500">{message}</p>
        </div>
    );
};

export default Loader;
