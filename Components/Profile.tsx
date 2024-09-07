"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface Complaint {
  id: string;
  title: string;
  photos: string[];
  status: "active" | "resolved";
  createdAt: string; // Date string
}

const Profile: React.FC = () => {
  const [showComplaints, setShowComplaints] = useState<boolean>(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "resolved">(
    "all"
  );

  useEffect(() => {
    // Fetch complaints from API
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/complaints"); // Replace with your API endpoint
        setComplaints(response.data);
      } catch (error) {
        console.error("Failed to fetch complaints", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (showComplaints) {
      fetchComplaints();
    }
  }, [showComplaints]);

  const now = new Date();

  const getComplaintsByStatus = (status: "all" | "active" | "resolved") => {
    return complaints.filter(
      (complaint) => status === "all" || complaint.status === status
    );
  };

  const handleRepostComplaint = (id: string) => {
    // Logic to repost complaint
    window.location.href = `/repost-complaint/${id}`;
  };

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
            <h1 className="text-2xl font-bold text-gray-900">User</h1>
            <p className="text-sm text-gray-600">user@nsut.ac.in</p>
            <p className="text-sm text-gray-600">+91 9999999999</p>
            <p className="text-sm text-gray-600">Nsut Dwarka</p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-4 w-full">
            <Link href="/wallet">
              <button
                type="button"
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
              >
                Wallet
              </button>
            </Link>
            <button
              onClick={() => setShowComplaints(!showComplaints)}
              className="w-full bg-blue-500 text-white mt-2 py-2 rounded-lg font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
            >
              {showComplaints
                ? "Hide Registered Complaints"
                : "Show Registered Complaints"}
            </button>
          </div>

          {/* Complaints Section */}
          {showComplaints && (
            <div className="w-full mt-6 bg-white p-4 rounded-lg shadow-lg">
              <div className="mb-4">
                {/* Tab Navigation */}
                <div className="flex space-x-2 justify-between mb-4">
                  {["all", "active", "resolved"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() =>
                        setActiveTab(tab as "all" | "active" | "resolved")
                      }
                      className={`flex-1 py-2 px-2 sm:px-4 text-center rounded-t-lg ${
                        activeTab === tab
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      } hover:bg-blue-400`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Complaints Dropdown */}
                <div className="bg-white rounded-lg shadow-md">
                  {loading ? (
                    <p className="text-center text-gray-600">
                      Loading complaints...
                    </p>
                  ) : (
                    <>
                      {getComplaintsByStatus(activeTab).map((complaint) => {
                        const complaintDate = new Date(complaint.createdAt);
                        const diffDays = Math.floor(
                          (now.getTime() - complaintDate.getTime()) /
                            (1000 * 60 * 60 * 24)
                        );

                        return (
                          <div key={complaint.id} className="border-t border-gray-200">
                            <div className="p-4">
                              <h3 className="text-lg font-bold text-gray-900">
                                {complaint.title}
                              </h3>
                              <div className="flex gap-2 mt-2 flex-wrap">
                                {complaint.photos.map((photo, index) => (
                                  <img
                                    key={index}
                                    src={photo}
                                    alt={`Complaint ${complaint.title} Photo ${
                                      index + 1
                                    }`}
                                    className="w-24 h-24 object-cover rounded-md"
                                  />
                                ))}
                              </div>
                              {activeTab === "all" && (
                                <p className="mt-2 text-sm text-gray-500">
                                  Status:{" "}
                                  {complaint.status.charAt(0).toUpperCase() +
                                    complaint.status.slice(1)}
                                </p>
                              )}
                              {activeTab === "active" && diffDays > 3 && (
                                <button
                                  onClick={() =>
                                    handleRepostComplaint(complaint.id)
                                  }
                                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                                >
                                  Repost Complaint
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
