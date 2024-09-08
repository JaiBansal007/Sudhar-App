import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function Chatbot() {
  const [userMessage, setUserMessage] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { 
      type: 'incoming', 
      message: 'Hi there 👋 How can I help you today?', 
      suggestions: ['Lodge a Complaint', 'View Past Complaints', 'Open Wallet', 'Contact Us']
    },
  ]);

  const chatInputRef = useRef(null);
  const chatboxRef = useRef<HTMLUListElement | null>(null); // Refers to a <ul> element
  const router = useRouter();
  useEffect(() => {
    const chatbox = chatboxRef.current;
    if (chatbox) {
      // Ensure scrollHeight exists, otherwise fall back to 0
      chatbox.scrollTop = chatbox.scrollHeight ?? 0;
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

  const addMessage = (message: string, type: string, suggestions: string[] = []) => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { type, message, suggestions },
    ]);
  };

  const generateResponse = async () => {
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyB89G7to5xiP-_8qlFDC-vOdooaAqqlmww`;
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

  const generateSuggestions = (responseMessage: string) => {
    if (responseMessage.toLowerCase().includes('help')) {
      return ['Lodge a Complaint', 'View Past Complaints', 'Open Wallet', 'Contact Us'];
    }
    if (responseMessage.toLowerCase().includes('complaint')) {
      return ['Lodge a Complaint', 'View Past Complaints'];
    }
    return [];
  };

  const updateLastMessage = (message: string, suggestions: string[] = [], isError: boolean = false) => {
    setChatMessages((prevMessages) => {
      const lastMessage = prevMessages[prevMessages.length - 1];
      lastMessage.message = message;
      lastMessage.suggestions = suggestions;
      return [...prevMessages];
    });
  };

  const fetchWalletDetails = async (userId: string) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const { balance, orders } = userSnap.data();
      const sortedTransactions = orders
  ? orders.sort((a: { time: string | Date }, b: { time: string | Date }) => 
      new Date(b.time).getTime() - new Date(a.time).getTime()
    ).slice(0, 3)
  : [];

      return { balance, transactions: sortedTransactions };
    }
    return { balance: 0, transactions: [] };
  };

  const fetchComplaints = async (userId: string) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const { complaint } = userSnap.data();
      return complaint || [];
    }
    return [];
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { type: 'incoming', message: `You selected "${suggestion}"`, suggestions: [] }
    ]);

    setTimeout(async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/signin');
        return;
      }

      const userId = user.uid;

      if (suggestion === 'Lodge a Complaint') {
        router.push('/complaint');
      } else if (suggestion === 'Open Wallet') {
        const { balance, transactions } = await fetchWalletDetails(userId);
        
        const walletMessage =
          `Available Coins: ${balance}\n\n` + // Ensure new line after balance
          `Latest Transactions:\n` + // Start transactions on a new line
          transactions.map((t: any) => `${t.time.substring(0, 10)} - ${t.voucherName}: ${t.voucherPrice}`).join('\n'); // Each transaction on a new line
      
        addMessage(walletMessage, 'incoming');
      } else if (suggestion === 'Contact Us') {
        router.push('/contact');
      } else if (suggestion === 'View Past Complaints') {
        const complaints = await fetchComplaints(userId);
        const complaintsMessage = complaints.length
          ? complaints.map((c:any) => `Title: ${c.title}\nStatus: ${c.status}\nDescription: ${c.description}`).join('\n\n')
          : 'You have no registered complaints.';
        addMessage(complaintsMessage, 'incoming');
      } else {
        addMessage(`You selected "${suggestion}"`, 'incoming', generateSuggestions(''));
      }
    }, 600);
  };

  const toggleChatbot = () => {
    setShowChatbot((prev) => !prev);
  };

  return (
    <>
      <Head>
        <title>Modern Chatbot UI</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
      </Head>

      {/* Chatbot toggle button */}
      <button
  onClick={toggleChatbot}
  className="fixed right-4 bottom-4 p-0 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg hover:shadow-xl hover:scale-105 transition-transform ease-in-out duration-300 flex items-center justify-center overflow-hidden"
>
  <img 
    src="/4.png"  // Static image path that does not change
    alt="Sudhaar Mitar"
    className="w-20 h-20 transform translate-y-2 rounded-full object-contain" // Increased size and adjusted position
  />
</button>




      {/* Chatbot container */}
      {showChatbot && (
        <div className="fixed right-4 bottom-20 w-72 md:w-80 lg:w-96 bg-white rounded-xl shadow-2xl overflow-hidden transition-transform transform scale-100 opacity-100">
          <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center rounded-t-xl shadow-sm">
            <h2 className="font-semibold">Assistant</h2>
          </header>

          {/* Chat messages */}
          <ul className="h-80 p-4 space-y-4 overflow-y-auto" ref={chatboxRef}>
            {chatMessages.map((chat, index) => (
              <li key={index} className={`flex ${chat.type === 'incoming' ? 'justify-start' : 'justify-end'}`}>
                {chat.type === 'incoming' ? (
                  <div className="bg-gray-200 text-gray-800 p-3 rounded-2xl shadow-md max-w-xs">
                    <p>{chat.message}</p>
                    {chat.suggestions && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {chat.suggestions.map((suggestion, i) => (
                          <button
                            key={i}
                            className="bg-blue-500 text-white py-1 px-3 rounded-xl text-sm hover:bg-blue-700 transition-all"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-md max-w-xs">
                    <p>{chat.message}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Input area */}
          <div className="flex items-center p-3 bg-gray-100">
            <textarea
              className="flex-1 p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a message..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              ref={chatInputRef}
            />
            <button
              className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 transition-all"
              onClick={handleSendMessage}
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
