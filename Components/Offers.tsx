"use client"; // Ensure this is a client-side component

import React from 'react';
import { useRouter } from 'next/navigation';

const OffersPage: React.FC = () => {
  const router = useRouter();
  const walletBalance = 1500; // Available balance

  // Sample offers data
  const offers = [
    { name: "50% Off on Electronics", price: 500 },
    { name: "Buy 1 Get 1 Free on Apparel", price: 299 },
    { name: "₹200 Cashback on Orders Above ₹1000", price: 200 },
    { name: "Free Shipping on Orders Above ₹500", price: 0 },
  ];

  const handleVoucherClick = (price: number) => {
    if (price <= walletBalance) {
      // Redirect to transaction page if voucher can be redeemed
      router.push('/transaction');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mt-8 p-6 bg-white rounded-lg shadow-md">
        {/* Company Info Section */}
        <div className="flex items-center mb-8">
          <img
            src="/path/to/logo.png" // Replace with your logo path
            alt="Company Logo"
            className="h-12 w-auto mr-4"
          />
          <h1 className="text-3xl font-bold text-gray-900">Company Name</h1>
        </div>

        {/* Wallet Balance Section */}
        <div className="mb-6 p-4 bg-blue-500 text-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold">Available Wallet Balance</h2>
          <p className="text-2xl font-semibold">₹{walletBalance}</p>
        </div>

        {/* Vouchers Section */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Available Vouchers</h3>
          <div className="space-y-4">
            {offers.map((offer, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-4 bg-white rounded-lg shadow-md border ${
                  offer.price > walletBalance ? 'border-gray-300 cursor-not-allowed' : 'border-gray-200 hover:border-blue-500 cursor-pointer'
                }`}
                onClick={() => offer.price <= walletBalance && handleVoucherClick(offer.price)}
              >
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{offer.name}</h4>
                </div>
                <div>
                  <p className={`text-lg font-bold ${
                    offer.price > walletBalance ? 'text-gray-500' : 'text-blue-500'
                  }`}>₹{offer.price === 0 ? 'Free' : offer.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;
