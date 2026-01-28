import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const VoiceAssistant = () => {
    const [isListening, setIsListening] = useState(false);
    const navigate = useNavigate();
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onresult = (event) => {
            const current = event.resultIndex;
            const transcript = event.results[current][0].transcript.toLowerCase();
            console.log("Transcript:", transcript);

            const speak = (text) => {
                const utterance = new SpeechSynthesisUtterance(text);
                window.speechSynthesis.speak(utterance);
            };

            if (transcript.includes('disease') || transcript.includes('predict')) {
                speak("Opening disease prediction camera.");
                navigate('/disease?camera=true');
            } else if (transcript.includes('crop') || transcript.includes('recommend')) {
                speak("Opening crop recommendation.");
                navigate('/crop');
            } else if (transcript.includes('fertilizer')) {
                speak("Opening fertilizer recommendation.");
                navigate('/fertilizer');
            } else if (transcript.includes('home')) {
                speak("Going home.");
                navigate('/');
            } else {
                speak("I didn't catch that. Please try again.");
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [navigate]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Voice recognition not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) return null;

    return (
        <div
            className={`fixed bottom-24 right-6 z-50 rounded-full overflow-hidden cursor-pointer shadow-xl transition-all duration-500 ease-in-out ${isListening ? 'w-32 h-32 shadow-2xl' : 'w-16 h-16 hover:scale-110'
                }`}
            onClick={toggleListening}
            role="button"
            tabIndex={0}
            aria-label={isListening ? "Stop listening" : "Start listening"}
        >
            <video
                src="https://firebasestorage.googleapis.com/v0/b/test-storage-ai.appspot.com/o/tropica-hive-asset%2Fagent%2Fagent.mp4?alt=media&token=135b88ee-0a4e-4f7f-9f8e-7ca0a4555e8c"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover scale-150 pointer-events-none"
            />
        </div>
    );
};

export default VoiceAssistant;
