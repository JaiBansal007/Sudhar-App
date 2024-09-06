
"use client";

import Link from 'next/link';
import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          {/* Profile Photo */}
          <div className="w-24 h-24 mb-6">
            <img
              src="/2.webp" // Replace with your photo path
              alt="Profile Photo"
              className="w-full h-full rounded-full object-cover border-4 border-blue-500"
            />
          </div>

          {/* Profile Information */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">User</h1>
            <p className="text-sm text-gray-600">user@nsut.ac.in</p>
            <p className="text-sm text-gray-600">+91 9999999999</p>
            <p className="text-sm text-gray-600">Nsut Dwarka</p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-4 w-full">
            <Link href="/wallet"><button
              type="button"
              className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
            >
              Wallet
            </button>
            </Link>
            <Link href="/order">
            <button
              type="button"
              className="w-full bg-blue-500 text-white mt-2 py-2 rounded-lg font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
            >
              Registered Complaints
            </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
