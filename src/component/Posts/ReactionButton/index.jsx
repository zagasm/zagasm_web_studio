import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ReactionStyle.css';

// Import sound file directly (adjust path as needed)
import clickSound from './click.mp3'; 

export function ReactionButton({
    initialCount,
    emoji = "😂",
    postId,
    userId,
    i_react,
    reactionType = "haha"
}) {
    const [reactionCount, setReactionCount] = useState(initialCount);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [current_i_react, setIscurrent_i_react] = useState(i_react);
    const audioRef = useRef(null);

    // Initialize audio
    useEffect(() => {
        audioRef.current = new Audio(clickSound);
        audioRef.current.volume = 0.3;
        audioRef.current.preload = 'auto';

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const playSound = () => {
        try {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => {
                console.error("Audio play failed:", e);
                playFallbackBeep();
            });
        } catch (e) {
            console.error("Audio error:", e);
            playFallbackBeep();
        }
    };

    const playFallbackBeep = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.2;
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        setTimeout(() => oscillator.stop(), 100);
    };

    const sendReactionToServer = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('do', 'react_post');
            formData.append('id', postId);
            formData.append('reaction', reactionType);
            formData.append('user_id', userId);
            formData.append('api_secret_key', 'Zagasm2025!Api_Key_Secret');

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/includes/ajax/posts/clients_reactions.php`,
                formData
            );

            if (response.data.success) {
                const serverCount = parseInt(response.data.reactions[`reaction_${reactionType}_count`]);
                setReactionCount(serverCount);
                setIscurrent_i_react(response.data.i_react === 'haha');
            }
        } catch (error) {
            console.error('Error sending reaction:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReactionClick = (e) => {
        e.preventDefault();
        if (isAnimating || isLoading) return;

        setIsAnimating(true);
        playSound();
        sendReactionToServer();

        setTimeout(() => setIsAnimating(false), 800); // Match animation duration
    };

    return (
          <button
            className={`reaction-container py-1  px-2 ${current_i_react ? 'i_react' : ''}`}
            onClick={handleReactionClick}
            aria-label="Add reaction"
            disabled={isLoading}
        >
            <span className="emoji-and-count">
                <span className={`emoji-wrapper ${isAnimating ? 'animate' : ''}`}>
                    {emoji}
                </span>
                <span className="reaction-count">
                    {current_i_react 
                        ? reactionCount > 1 
                            ? 'You & ' + (reactionCount - 1) 
                            : 'You' 
                        : reactionCount}
                </span>
            </span>
        </button>
    );
}