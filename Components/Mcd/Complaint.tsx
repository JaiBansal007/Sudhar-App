"use client";
import React, { useState } from "react";

interface Complaint {
  id: string;
  title: string;
  photo: string;
  location: string;
  status: "active" | "completed";
}

const ReceivedComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "1",
      title: "Garbage on the street",
      photo: "/garbage.jpg", // Replace with actual photo URL
      location: "Dwarka, New Delhi",
      status: "active",
    },
    {
      id: "2",
      title: "Potholes on the road",
      photo: "/pothole.jpg", // Replace with actual photo URL
      location: "Connaught Place, New Delhi",
      status: "completed",
    },
    {
      id: "3",
      title: "Broken streetlight",
      photo: "/streetlight.jpg", // Replace with actual photo URL
      location: "Rohini, New Delhi",
      status: "active",
    },
  ]);

  const markAsCompleted = (id: string) => {
    setComplaints((prev) =>
      prev.map((complaint) =>
        complaint.id === id ? { ...complaint, status: "completed" } : complaint
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Received Complaints</h1>

      <div className="w-full max-w-3xl space-y-6">
        {complaints.map((complaint) => (
          <div
            key={complaint.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col"
          >
            {/* Complaint Content */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900">{complaint.title}</h2>
              <p className="text-gray-600 mt-2">Location: {complaint.location}</p>

              {/* Complaint Photo */}
              <div className="mt-4">
                <img
                  src={complaint.photo}
                  alt={complaint.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Mark as Completed Button */}
            {complaint.status === "active" && (
              <div className="p-4 bg-gray-50 text-right">
                <button
                  onClick={() => markAsCompleted(complaint.id)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                >
                  Mark as Completed
                </button>
              </div>
            )}
            {complaint.status === "completed" && (
              <div className="p-4 bg-green-100 text-center">
                <p className="text-green-700 font-semibold">Completed</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceivedComplaints;
