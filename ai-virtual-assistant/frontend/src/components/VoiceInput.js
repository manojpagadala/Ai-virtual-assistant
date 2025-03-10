import React, { useState } from "react";
import axios from "axios";

const VoiceInput = () => {
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");

  const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      sendToBackend(speechResult); // Send the transcript to the backend
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  };

  const sendToBackend = async (message) => {
    try {
      const res = await axios.post("http://localhost:5000/api/ask", {
        prompt: message,
      });
      setResponse(res.data.response);
      speak(res.data.response); // Use Text-to-Speech to speak the response
    } catch (error) {
      console.error("Error sending message to backend:", error);
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="container mt-5">
      <h1>Voice-Based Virtual Assistant</h1>
      <button className="btn btn-primary" onClick={startListening}>
        Start Listening
      </button>
      <p className="mt-3">You said: {transcript}</p>
      <p>AI response: {response}</p>
    </div>
  );
};

export default VoiceInput;