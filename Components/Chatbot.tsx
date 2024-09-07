import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
 
export default function Chatbot() {
  const [userMessage, setUserMessage] = useState('');
  const [showChatbot, setShowChatbot] = useState(false); // Toggle chatbot visibility
  const [showMoreSuggestions, setShowMoreSuggestions] = useState(false); // Track when "More" is clicked
  const [chatMessages, setChatMessages] = useState([
    { 
      type: 'incoming', 
      message: 'Hi there 👋 How can I help you today?', 
      suggestions: ['Lodge a Complaint', 'View Past Complaints', 'Open Wallet', 'More Suggestions'] 
    },
  ]);
 
  const chatInputRef = useRef(null);
  const chatboxRef = useRef(null);
  const API_KEY = 'AIzaSyB89G7to5xiP-_8qlFDC-vOdooaAqqlmww';
 
  useEffect(() => {
    const chatbox = chatboxRef.current;
    if (chatbox) {
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  }, [chatMessages]);
 
  const handleSendMessage = () => {
    if (userMessage.trim() === '') return;
    addMessage(userMessage, 'outgoing');
    setUserMessage('');
    setTimeout(() => {
      addMessage('Thinking...', 'incoming');
      generateResponse();
    }, 600);
  };
 
  const addMessage = (message, type, suggestions = []) => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { type, message, suggestions },
    ]);
  };
 
  const generateResponse = async () => {
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `${userMessage}. Please provide a brief response.` }] }],
      }),
    };
 
    try {
      const res = await fetch(API_URL, requestOptions);
      const data = await res.json();
      const responseMessage = data.candidates[0].content.parts[0].text;
 
      // Provide suggestions based on the bot's response
      const suggestions = generateSuggestions(responseMessage);
 
      updateLastMessage(responseMessage, suggestions);
    } catch (error) {
      updateLastMessage('Oops! Something went wrong. Please try again later.', [], true);
    }
  };
 
 
  const generateSuggestions = (responseMessage) => {
    if (responseMessage.toLowerCase().includes('help')) {
      return ['More Suggestions'];
    }
    if (responseMessage.toLowerCase().includes('hi','hello')) {
        return ['More Suggestions'];
    }
    if (responseMessage.toLowerCase().includes('complaint')) {
      return ['More Suggestions'];
    }
    return ['More Suggestions'];
  };
 
  // Handle when "More" is clicked
  const handleShowMoreSuggestions = () => {
    setShowMoreSuggestions(true); // Mark that "More" has been clicked
 
    // Add new suggestions from your reference images
    addMessage('Here are more options for you:', 'incoming', [
      'Track Order',
      'Redeem Points',
      'Request Support',
      'Check Status',
      'Open Wallet', 
      'Show Offers Available',
    ]);
  };
 
  const updateLastMessage = (message, suggestions = [], isError = false) => {
    setChatMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      lastMessage.message = message;
      lastMessage.isError = isError;
      lastMessage.suggestions = suggestions;
      return [...prevMessages];
    });
  };
 
  // Handle suggestion clicks
  const handleSuggestionClick = (suggestion) => {
    // Instead of sending "Ok", skip sending any message from the user
    setTimeout(() => {
      if (suggestion === 'More Suggestions') {
        handleShowMoreSuggestions(); // Show more suggestions when "More" is clicked
      } else {
        addMessage(`You selected "${suggestion}"`, 'incoming', generateSuggestions(''));
      }
    }, 600);
  };
 
  // Toggle the chatbot display
  const toggleChatbot = () => {
    setShowChatbot((prev) => !prev);
  };
 
  return (
    <>
      <Head>
        <title>Chatbot in Next.js</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
      </Head>
 
      {/* Chatbot toggler button */}
      <button 
        onClick={toggleChatbot}
        className="chatbot-toggler fixed right-4 bottom-4 p-2 text-white flex items-center justify-center rounded-full bg-blue-600 shadow-lg"
      >
        <span className="material-symbols-outlined">
          {showChatbot ? 'close' : 'Chat Bot'}
        </span>
      </button>
 
      {/* Chatbot container */}
      {showChatbot && (
        <div className="chatbot fixed right-4 bottom-20 w-80 bg-white rounded-lg shadow-lg transition-transform transform scale-100 opacity-100">
          <header className="bg-blue-600 text-white text-center p-4 rounded-t-lg relative">
            <h2 className="font-semibold">Chat Bot</h2>
          </header>
 
          {/* Chatbox */}
          <ul className="chatbox h-72 overflow-y-auto p-4" ref={chatboxRef}> {/* Reduced height */}
            {chatMessages.map((chat, index) => (
              <li key={index} className={`mb-4 ${chat.type === 'incoming' ? 'text-left' : 'text-right'}`}>
                {chat.type === 'incoming' && (
                  <div className="flex flex-col justify-start"> {/* Use flexbox to align icon and message vertically */}
                    <span className="material-symbols-outlined text-blue-500 mr-2">Chat Bot</span>
                    <div className="flex flex-col">
                      <p className={`p-3 rounded-lg shadow-sm ${chat.type === 'incoming' ? 'bg-gray-200 text-black' : 'bg-blue-600 text-white'} ${chat.isError ? 'bg-red-200 text-red-600' : ''}`}>
                        {chat.message}
                      </p>
 
                      {/* Render suggestions */}
                      {chat.suggestions && chat.suggestions.length > 0 && (
                        <div className="flex flex-wrap mt-2 gap-2"> {/* Spacing between buttons */}
                          {chat.suggestions.map((suggestion, i) => (
                            <button
                              key={i}
                              className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-700 transition-all"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
 
                {chat.type === 'outgoing' && (
                  <div className="flex flex-row-reverse">
                    <p className="p-2 bg-blue-600 text-white rounded-lg shadow-sm">
                      {chat.message}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
 
          {/* Chat input area */}
          <div className="chat-input flex items-center p-2 bg-gray-100">
            <textarea
              className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a message..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              ref={chatInputRef}
            />
            <span id="send-btn" className="material-symbols-outlined ml-2 cursor-pointer text-blue-600" onClick={handleSendMessage}>
              send
            </span>
          </div>
        </div>
      )}
    </>
  );
}