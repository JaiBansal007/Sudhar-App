"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import emailjs from 'emailjs-com';  // Import emailjs

const TransactionPage = () => {
  const searchParams = useSearchParams();
  const voucherName = searchParams.get('voucherName') || 'Unknown Voucher';
  const voucherPrice = parseInt(searchParams.get('voucherPrice') || '0');
  const [initialBalance, setInitialBalance] = useState(0);
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState<string|null>("");  // To store the user's email
  const [balance, setBalance] = useState(initialBalance);
  const [finalBalance, setFinalBalance] = useState(initialBalance);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        setUserEmail(user.email);  // Capture the user's email
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const fetchedBalance = userSnap.data().balance;

          // Set balance in state
          setInitialBalance(fetchedBalance);
          setFinalBalance(fetchedBalance - voucherPrice);
          setBalance(fetchedBalance);
        }
      } else {
        router.push("/login");
      }
    });
  }, [router, voucherPrice]);

  // Function to handle transaction completion
  const handleCompleteTransaction = () => {
    if (finalBalance >= 0) {
      toast.success('Transaction Successfully Completed!');

      // Send email notification via emailjs
      sendEmailNotification();
    } else {
      toast.error('Insufficient Balance!');
    }
  };

  // Function to calculate final balance after subtracting voucher price
  const handleTransaction = async () => {
    const updatedBalance = balance - voucherPrice;
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const currentBalance = Number(userSnap.data().balance) - voucherPrice;
      await updateDoc(userRef, {
        balance: currentBalance,
        orders: arrayUnion({
          time: new Date().toISOString(),
          voucherName: voucherName,
          voucherPrice: -voucherPrice
        })
      });
    }
    setBalance(updatedBalance);
    setFinalBalance(updatedBalance);
    router.push('/wallet');
  };

  // Function to send email notification using emailjs
  const sendEmailNotification = () => {
    const emailParams = {
      user_email: userEmail,  // Recipient email
      voucher_name: voucherName,  // Voucher details
      voucher_price: voucherPrice,
      final_balance: finalBalance,  // Updated balance after transaction
    };

    emailjs.send(
      'service_9u9o46j',  // Replace with your EmailJS service ID
      'template_yihk7r6',  // Replace with your EmailJS template ID
      emailParams,
      'i52vi95BMEOUCfa2r'  // Replace with your EmailJS public key
    )
    .then((response) => {
      console.log('Email sent successfully:', response.status, response.text);
    })
    .catch((error) => {
      console.error('Failed to send email:', error);
    });
  };

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
