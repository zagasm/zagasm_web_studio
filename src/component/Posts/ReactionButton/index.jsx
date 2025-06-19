import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
export function ReactionButton({
    initialCount,
    emoji = "😂",
    postId,
    userId,
    reactionType = "haha"
}) {
    const [reactionCount, setReactionCount] = useState(initialCount);
    const [isAnimating, setIsAnimating] = useState(false);
    const audioRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    // Base64 encoded fallback beep sound
    const fallbackBeep = 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...';

    useEffect(() => {
        // Try loading external sound first, then fallback
        audioRef.current = new Audio();
        audioRef.current.volume = 0.8;

        // Try multiple sources
        const sources = [
            '/computer-mouse-click-351398.mp3',       // First try project sound
            '/computer-mouse-click-351398.mp3',       // Alternate format
            // fallbackBeep              // Fallback base64 sound
        ];

        let sourceIndex = 0;

        const tryLoadSource = () => {
            if (sourceIndex >= sources.length) return;

            audioRef.current.src = sources[sourceIndex];
            audioRef.current.load();

            audioRef.current.onerror = () => {
                sourceIndex++;
                tryLoadSource();
            };
        };

        tryLoadSource();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

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
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                // Use the exact count from server response
                const serverCount = parseInt(response.data.reactions[`reaction_${reactionType}_count`]);
                setReactionCount(serverCount);
                // console.log('Reaction successfully sent:', serverCount);
                // showToast.info(response.data.message);
            } else {
                console.error('Failed to send reaction:', response.data.message);
                // Don't rollback here - we'll use server's count
            }
        } catch (error) {
            console.error('Error sending reaction:', error);
            // On error, keep the optimistic update but mark it as potentially stale
        } finally {
            setIsLoading(false);
        }
    };

    const handleReactionClick = (e) => {
        e.preventDefault();
        if (isAnimating || isLoading) return;

        setIsAnimating(true);
        // Optimistic update - increment immediately
        // setReactionCount(prev => prev + 1);

        // Play sound
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => {
                console.warn("Sound playback failed:", e);
                playFallbackBeep();
            });
        } else {
            playFallbackBeep();
        }

        // Send reaction to server
        sendReactionToServer();

        setTimeout(() => setIsAnimating(false), 400);
    };

    const playFallbackBeep = () => {
        // Web Audio API fallback
        if (window.AudioContext || window.webkitAudioContext) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.3;

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start();
            setTimeout(() => {
                oscillator.stop();
            }, 100);
        }
    };

    return (
        <button
            className="reaction-button relative border-0 bg-transparent p-0"
            onClick={handleReactionClick}
            aria-label="Add reaction"
        >
            <span
                className={`emoji-container ${isAnimating ? 'animate' : ''}`}
                role="img"
                aria-hidden="true"
            >
                {emoji}
            </span>
            <span className="count ms-1">{reactionCount}</span>
        </button>
    );
}