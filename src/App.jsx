import React, { useState } from "react";
import axios from "axios";
import logo from "./assets/logo.png";

function App() {
  const [question, setQuestion] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(false); // Manage welcome message visibility

  async function generateAnswer() {
    if (!question.trim()) {
      return;
    }

    // Add user's question to the conversation
    setConversation((prev) => [...prev, { type: "user", text: question }]);

    // Hide the welcome message after the first user input
    if (isWelcomeVisible) {
      setIsWelcomeVisible(false);
    }

    setLoading(true);
    setQuestion("");

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=",
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          prompt: {
            text: question,
          },
          maxOutputTokens: 256,
        },
      });

      setConversation((prev) => [
        ...prev,
        {
          type: "bot",
          text: response.data.candidates[0].output || "No answer found.",
        },
      ]);
    } catch (error) {
      console.error("Error fetching the answer:", error);
      setConversation((prev) => [
        ...prev,
        { type: "bot", text: "An error occurred. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !loading) {
      generateAnswer();
    }
  }

  function handleToggleChat() {
    setIsChatVisible((prev) => {
      const newVisibility = !prev;
      if (newVisibility) {
        setIsWelcomeVisible(true); // Show welcome message when chat opens
      }
      return newVisibility;
    });
  }

  return (
    <div className="relative min-h-screen flex items-end justify-end bg-gray-100">
      {/* Toggle Button */}
      <button
        onClick={handleToggleChat}
        className="fixed bottom-4 right-4 p-4 bg-green-700 text-white rounded-full shadow-lg hover:bg-green-800 transition duration-300"
      >
        {isChatVisible ? "Close Chat" : "Open Chat"}
      </button>

      {/* Chat Container */}
      {isChatVisible && (
        <div className="absolute bottom-0 right-0 m-4 flex flex-col w-full max-w-md bg-white rounded-lg shadow-md">
          <header className="flex items-center justify-center p-4 bg-green-700 rounded-t-lg">
            <img
              src={logo}
              alt="Logo"
              className="h-16 w-16 rounded-full border-2 border-green-700 mr-3"
            />
            <h1 className="text-2xl font-bold text-white">THE CHAT-BOT</h1>
          </header>
          <main className="flex-1 p-4 bg-gray-100 border-t-2 border-gray-200 rounded-b-lg overflow-auto">
            {isWelcomeVisible && (
              <div className="mb-4 p-3 rounded-lg bg-blue-100 text-blue-800 text-center">
                Welcome! How can I assist you today?
              </div>
            )}
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-3 rounded-lg flex items-start ${
                  msg.type === "user"
                    ? "bg-green-100 text-gray-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.type === "bot" && (
                  <img
                    src={logo}
                    alt="Bot Avatar"
                    className="h-8 w-8 rounded-full border-2 border-gray-300 mr-2"
                  />
                )}
                <p>{msg.text}</p>
              </div>
            ))}
            {loading && (
              <div className="mb-2 p-3 rounded-lg bg-gray-200 text-gray-800 text-left">
                Thinking...
              </div>
            )}
          </main>
          <footer className="p-4 bg-white border-t-2 border-gray-200">
            <input
              type="text"
              value={question}
              placeholder="Type your question here..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-md focus:outline-none focus:border-green-500 bg-gray-100"
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={generateAnswer}
              className="w-full mt-2 py-3 px-4 bg-green-700 text-white rounded-md hover:bg-green-800 transition duration-300 font-semibold"
              disabled={loading}
            >
              Generate Answer
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
