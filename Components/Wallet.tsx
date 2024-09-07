"use client";

import React, { useState } from 'react';

const Wallet: React.FC = () => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);

  // Sample data
  const coins = [
    { value: "$15,000" },   
  ];

  const transactions = [
    { date: "2024-09-01", description: "Bought 0.1 BTC", amount: "-$3,000" },
    { date: "2024-09-05", description: "Sold 1 ETH", amount: "+$1,500" },
    { date: "2024-09-10", description: "Transfer to Wallet", amount: "-$500" },
  ];

  const handleCoinClick = (coin: string) => {
    setSelectedCoin(coin);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900">Wallet</h2>

        {/* Coins Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Available Coins</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coins.map((coin) => (
              
              <div
                
                className="bg-blue-500 text-white flex justify-center p-4 rounded-lg shadow-md cursor-pointer hover:bg-blue-600"
                onClick={() => handleCoinClick(coin.value)}
              >
                <p className="text-lg font-bold">{coin.value}</p>
              </div>
              
            ))}
          </div>
        </div>

        {/* Transactions Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Past Transactions</h3>
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popup */}
        {showPopup && selectedCoin && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-full">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Details for {selectedCoin}</h4>
              <p className="text-gray-700 mb-4">Details and statistics about {selectedCoin} would go here.</p>
              <button
                type="button"
                onClick={handleClosePopup}
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
