"use client";
import React, { useState } from "react";

interface Complaint {
  id: string;
  title: string;
  photo: string;
  location: string;
  status: "active" | "completed";
  user: {
    name: string;
    phone: string;
  };
}

const ReceivedComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "1",
      title: "Garbage on the street",
      photo: "/garbage.jpg",
      location: "Dwarka, New Delhi",
      status: "active",
      user: { name: "John Doe", phone: "+91 9999999999" },
    },
    {
      id: "2",
      title: "Potholes on the road",
      photo: "/pothole.jpg",
      location: "Connaught Place, New Delhi",
      status: "completed",
      user: { name: "Jane Smith", phone: "+91 8888888888" },
    },
    {
      id: "3",
      title: "Broken streetlight",
      photo: "/streetlight.jpg",
      location: "Rohini, New Delhi",
      status: "active",
      user: { name: "Alex Johnson", phone: "+91 7777777777" },
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
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-row items-center p-6"
          >
            {/* Complaint Photo */}
            <div className="w-1/3">
              <img
                src={complaint.photo}
                alt={complaint.title}
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>

            {/* Complaint Information */}
            <div className="w-2/3 pl-6">
              <h2 className="text-xl font-bold text-gray-900">{complaint.title}</h2>
              <p className="text-gray-600 mt-2">Location: {complaint.location}</p>
              <p className="text-gray-600 mt-1">User: {complaint.user.name}</p>
              <p className="text-gray-600 mt-1">Phone: {complaint.user.phone}</p>

              {/* Mark as Completed Button */}
              {complaint.status === "active" && (
                <div className="mt-4 text-right">
                  <button
                    onClick={() => markAsCompleted(complaint.id)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                  >
                    Mark as Completed
                  </button>
                </div>
              )}

              {/* Completed Label */}
              {complaint.status === "completed" && (
                <div className="mt-4 text-right">
                  <p className="bg-green-500 w-28 text-white py-2 px-4 rounded-lg font-semibold">
                    Completed
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceivedComplaints;
