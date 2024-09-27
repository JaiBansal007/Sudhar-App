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
      suggestions: ['Lodge a Complaint', 'View Past Complaints', 'Open Wallet', 'Contact Us', 'Sell Scrap', 'Scrap Orders'] // Added 'Scrap Orders'
    },
  ]);

  const chatInputRef = useRef(null);
  const chatboxRef = useRef<HTMLUListElement | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const chatbox = chatboxRef.current;
    if (chatbox) {
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

      const suggestions = generateSuggestions(responseMessage);
      updateLastMessage(responseMessage, suggestions);
    } catch (error) {
      updateLastMessage('Oops! Something went wrong. Please try again later.', [], true);
    }
  };

  const generateSuggestions = (responseMessage: string) => {
    if (responseMessage.toLowerCase().includes('help')) {
      return ['Lodge a Complaint', 'View Past Complaints', 'Open Wallet', 'Contact Us', 'Sell Scrap', 'Scrap Orders']; // Added 'Scrap Orders'
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

  const fetchOrderDetails = async (userId: string) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const { trading } = userSnap.data();
      const sortedOrders = trading
        ? trading.sort((a: { time: string | Date }, b: { time: string | Date }) => 
            new Date(b.time).getTime() - new Date(a.time).getTime()
          ).slice(0, 3)
        : [];

      return sortedOrders;
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
          `Available Coins: ${balance}\n\n\n` +
          `Latest Transactions:\n` +
          transactions.map((t: any) => `${t.time.substring(0, 10)} - ${t.voucherName}: ${t.voucherPrice}`).join('\n\n\n');

        addMessage(walletMessage, 'incoming');
      } else if (suggestion === 'Contact Us') {
        router.push('/contact');
      } else if (suggestion === 'View Past Complaints') {
        const complaints = await fetchComplaints(userId);
        const complaintsMessage = complaints.length
          ? complaints.map((c: any) => 
              `Title: ${c.title}\nStatus: ${c.status}\nDescription: ${c.description}`
            ).join('\n\n')
          : 'You have no registered complaints.';
        addMessage(complaintsMessage, 'incoming');
      } else if (suggestion === 'Sell Scrap') {
        router.push('/sell');
      } else if (suggestion === 'Scrap Orders') { // New handling for Scrap Orders
        const orders = await fetchOrderDetails(userId);
        const ordersMessage = orders.length
          ? orders.map((o: any) => 
              `\nTitle: ${o.title}\nStatus: ${o.status}\nDescription: ${o.description}\nPrice: ₹${o.price}`
            ).join('\n\n')
          : 'You have no recent scrap orders.';
        addMessage(ordersMessage, 'incoming');
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
          src="/4.png" 
          alt="Sudhaar Mitar"
          className="w-20 h-20 transform translate-y-2 rounded-full object-contain"
        />
      </button>

      {/* Chatbot container */}
      {showChatbot && (
        <div className="fixed right-4 bottom-20 w-72 md:w-80 lg:w-96 bg-white rounded-xl shadow-2xl overflow-hidden transition-transform transform scale-100 opacity-100">
          <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center rounded-t-xl shadow-sm">
            <h2 className="font-semibold">Sudhaar Mitra</h2>
          </header>

          {/* Chat messages */}
          <ul className="h-80 p-4 space-y-4 overflow-y-auto" ref={chatboxRef}>
            {chatMessages.map((chat, index) => (
              <li key={index} className={`flex ${chat.type === 'incoming' ? 'justify-start' : 'justify-end'}`}>
                {chat.type === 'incoming' ? (
                  <div className="bg-gray-100 text-gray-900 p-3 rounded-lg shadow-lg text-sm max-w-xs">
                    {chat.message.split('\n').map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}

                    {/* Suggestions */}
                    {chat.suggestions.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {chat.suggestions.map((suggestion, idx) => (
                          <li
                            key={idx}
                            className="cursor-pointer bg-blue-600 text-white px-2 py-1 rounded-lg shadow-sm text-m"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <div className="bg-blue-500 text-white p-3 rounded-lg shadow-lg text-sm max-w-xs">
                    {chat.message.split('\n').map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Input and send button */}
          <div className="p-4 bg-gray-100 flex items-center space-x-4">
            <input
              type="text"
              className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type Hi or Ask any General Query"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              ref={chatInputRef}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
