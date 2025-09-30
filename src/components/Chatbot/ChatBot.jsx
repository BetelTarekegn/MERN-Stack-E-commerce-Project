import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, updateLastBotMessage } from "../../redux/features/chatbotSlice.js";
import { useSendMessageMutation } from "../../redux/api/chatbotApi.js";
import "./ChatBot.css";

const ChatBot = ({ initialQuestion }) => {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [hasSentInitial, setHasSentInitial] = useState(false);
  const dispatch = useDispatch();
  const chat = useSelector((state) => state.chat.messages);
  const [sendMessageApi] = useSendMessageMutation();
  const chatEndRef = useRef(null);

  // Scroll to bottom automatically
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isTyping]);

  // Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const startListening = () => {
    if (!recognition) return alert("Speech Recognition not supported!");
    setListening(true);
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onend = () => setListening(false);
  };

  const sendMessage = async (customInput) => {
    const message = customInput || input;
    if (!message.trim()) return;

    // Show user message
    dispatch(addMessage({ sender: "user", text: message }));
    setInput("");

    try {
      setIsTyping(true);
      dispatch(addMessage({ sender: "bot", text: "" }));

      const data = await sendMessageApi({ message }).unwrap();
      const fullMessage = data.botMessage;
      let index = 0;

      const typingInterval = setInterval(() => {
        index++;
        dispatch(
          updateLastBotMessage({
            text: fullMessage.slice(0, index),
            products: index === fullMessage.length ? data.recommendations : [],
          })
        );

        if (index === fullMessage.length) {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 20);
    } catch (error) {
      console.error("Chatbot error:", error);
      setIsTyping(false);
    }
  };

  // Auto-send initialQuestion if provided
  useEffect(() => {
    if (initialQuestion && !hasSentInitial) {
      sendMessage(initialQuestion);
      setHasSentInitial(true);
    }
  }, [initialQuestion, hasSentInitial]);

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        {chat.map((c, i) => (
          <div key={i} className={`chat-box ${c.sender}`}>
            <p>{c.text}</p>
            {c.products && c.products.length > 0 && (
              <ul>
                {c.products.map((p) => (
                  <li key={p._id}>
                    <strong>{p.name}</strong> - ${p.price}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="chat-box bot typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for product recommendations..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={() => sendMessage()}>Send</button>
        <button onClick={startListening} className={listening ? "listening" : ""}>
          🎤
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
