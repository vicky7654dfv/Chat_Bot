import React, { useState } from "react";
import axios from "axios";
import logo from './assets/logo.png'

function App() {
  const [question, setQuestion] = useState(""); 
  const [answer, setAnswer] = useState(""); 
  const [submittedQuestion, setSubmittedQuestion] = useState(""); 
  const [loading, setLoading] = useState(false); 

  async function generateAnswer() {
    if (!question) {
      setAnswer("Please enter a question first.");
      return;
    }

    setSubmittedQuestion(question); 
    setLoading(true); 
    setAnswer(""); 
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

      setAnswer(response.data.candidates[0].output || "No answer found.");
    } catch (error) {
      console.error("Error fetching the answer:", error); 
      setAnswer("An error occurred. Please try again later.");
    } finally {
      setLoading(false); 
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {" "}
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {" "}
        <h1 className="text-2xl font-bold mb-4 text-center text-green-700">
          <img
            src={logo}
            alt=""
            className="h-20 w-25 justify-center items-center"
          /> 
          THE CHAT-BOT
        </h1>
        <div className="mb-4 p-4 border-2 border-gray-200 rounded-md bg-gray-100 h-48 overflow-auto">
          {" "}
          {submittedQuestion && (
            <>
              <p className="text- font-semibold text-gray-600">
                Your Question:
              </p>
              <p className="mb-2">{submittedQuestion}</p>
              <hr className="my-2" />
            </>
          )}
          <p className="text-sm font-semibold text-gray-600">Answer:</p>
          <p>{loading ? "Thinking..." : answer}</p>{" "}
        </div>
        <input
          type="text"
          value={question}
          placeholder="Type your question here..."
          className="w-full mb-4 px-4 py-3 border-2 border-gray-200 rounded-md focus:outline-none focus:border-green-500 bg-gray-100"
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          onClick={generateAnswer}
          className="w-full py-3 px-4 bg-green-700 text-white rounded-md hover:bg-green-800 transition duration-300 font-semibold"
          disabled={loading}
        >
          Generate Answer
        </button>
      </div>
    </div>
  );
}

export default App;
