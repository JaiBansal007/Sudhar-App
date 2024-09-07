"use client";

import React from "react";


const Profile: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full mt-10 max-w-md bg-white p-8 rounded-lg shadow-lg">
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
            <h1 className="text-2xl font-bold text-gray-900">NGO</h1>
            <p className="text-sm text-gray-600">ngo@gamil.com</p>
            <p className="text-sm text-gray-600">+91 9999999999</p>
            <p className="text-sm text-gray-600">New Delhi</p>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default Profile;
