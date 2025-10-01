import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [input, setInput] = useState("");
    const [listening, setListening] = useState(false);
    const navigate = useNavigate();

    const saveAndGoToChatBot = (question) => {
        navigate("/chatbot", { state: { question } });
    };

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    const startListening = () => {
        if (!recognition) return alert("Speech Recognition not supported!");
        setListening(true);
        recognition.lang = "en-US";
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            saveAndGoToChatBot(transcript);
        };

        recognition.onend = () => setListening(false);
    };

    const goToChatBot = () => {
        if (!input.trim()) return;
        saveAndGoToChatBot(input);
    };

    return (
        <div className="home-page">
            <h2>Ask our ChatBot</h2>
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for product..."
            />
            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <button
                    onClick={goToChatBot}
                    style={{
                        backgroundColor: "#4cafaaff", // green
                        color: "#fff",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        cursor: "pointer",
                    }}
                >
                    Send
                </button>
                <button
                    onClick={startListening}
                    style={{
                        backgroundColor: listening ? "#FF5722" : "#4cafaaff", // red when listening, blue otherwise
                        color: "#fff",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        cursor: "pointer",
                    }}
                >
                    🎤
                </button>
            </div>
        </div>
    );
};

export default HomePage;
