import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ChatBot from "./ChatBot";

const ChatBotPage = () => {
  const location = useLocation();
  const { question } = location.state || {};
  const [lastQuestion, setLastQuestion] = useState("");

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("lastQuestion");
    if (saved) {
      setLastQuestion(saved);
    }

    // Save new one if passed from HomePage
    if (question) {
      localStorage.setItem("lastQuestion", question);
      setLastQuestion(question);
    }
  }, [question]);

  return (
    <div className="chatbot-page">
      <h2>ChatBot Conversation</h2>

      {lastQuestion && (
        <p className="last-question">
          <strong>Last asked:</strong> {lastQuestion}
        </p>
      )}

      <ChatBot initialQuestion={lastQuestion} />
    </div>
  );
};

export default ChatBotPage;
