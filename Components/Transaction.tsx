"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';

const TransactionPage = () => {
  const searchParams = useSearchParams();
  const voucherName = searchParams.get('voucherName') || 'Unknown Voucher';
  const voucherPrice = parseInt(searchParams.get('voucherPrice') || '0');
  const initialBalance = 1500; // Initial balance

  const [balance, setBalance] = useState(initialBalance);
  const [finalBalance, setFinalBalance] = useState(initialBalance);
  const [isMounted, setIsMounted] = useState(false); // To track when the component is mounted
  const router = useRouter();

  useEffect(() => {
    // Ensures this code runs only on the client-side
    setIsMounted(true);
  }, []);

  // Function to handle transaction completion
  const handleCompleteTransaction = () => {
    if (finalBalance >= 0) {
      toast.success('Transaction Successfully Completed!');

      // Redirect to home page after 2 seconds (only if mounted)
      if (isMounted) {
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } else {
      toast.error('Insufficient Balance!');
    }
  };

  // Function to calculate final balance after subtracting voucher price
  const handleTransaction = () => {
    const updatedBalance = balance - voucherPrice;
    setFinalBalance(updatedBalance);
  };

  if (!isMounted) {
    return null; // Return null during SSR, ensuring no rendering happens until it's mounted.
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Toaster for displaying notifications */}
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="max-w-lg w-full bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Complete Your Transaction</h1>

        {/* Voucher Info */}
        <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">Voucher: {voucherName}</h2>
          <p className="text-sm text-gray-600">Price: ₹{voucherPrice}</p>
        </div>

        {/* Available Balance */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
          <p className="text-lg font-semibold text-gray-800">Available Balance: ₹{balance}</p>
        </div>

        {/* Final Balance */}
        <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
          <p className="text-lg font-semibold text-gray-800">
            Final Balance: ₹{finalBalance >= 0 ? finalBalance : 'Insufficient funds'}
          </p>
        </div>

        {/* Calculation Info */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner text-gray-800">
          <p className="text-md">
            Final Balance Calculation: <span className="font-semibold">₹{balance}</span> - <span className="font-semibold">₹{voucherPrice}</span> = <span className="font-semibold">₹{balance - voucherPrice}</span>
          </p>
        </div>

        {/* Complete Transaction Button */}
        <button
          onClick={() => {
            handleTransaction();
            handleCompleteTransaction();
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all shadow-lg"
        >
          Complete Transaction
        </button>
      </div>
    </div>
  );
};

export default TransactionPage;
