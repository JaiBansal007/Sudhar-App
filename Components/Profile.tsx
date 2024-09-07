"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

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
  const [activeTab, setActiveTab] = useState<"all" | "active" | "resolved">("all");
  const [userID, setUserID] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDetails = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserID(user.uid);
          setUserEmail(user.email);
        } else {
          router.push("/signin");
        }
      });
    };

    fetchDetails();
  }, [router]);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (userID) {
        try {
          setLoading(true);
          const userRef = doc(db, "users", userID);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const fetchedComplaints = userSnap.data().complaint || [];
            setComplaints(fetchedComplaints);
          }
        } catch (error) {
          console.error("Failed to fetch complaints", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (showComplaints) {
      fetchComplaints();
    }
  }, [showComplaints, userID]);

  const now = new Date();

  const getComplaintsByStatus = (status: "all" | "active" | "resolved") => {
    return complaints.filter((complaint) => status === "all" || complaint.status === "active"|| complaint.status === "resolved");
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
            <h1 className="text-2xl font-bold text-gray-900">{auth.currentUser?.displayName || "User"}</h1>
            <p className="text-sm text-gray-600">{userEmail}</p>
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
            <Link href="/signin">
              <button
                onClick={() => auth.signOut()}
                type="button"
                className="w-full bg-slate-500 text-white mt-4 py-2 rounded-lg font-semibold hover:bg-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                Logout
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
                      onClick={() => setActiveTab(tab as "all" | "active" | "resolved")}
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

                {/* Complaints Display */}
                <div className="bg-white rounded-lg shadow-md">
                  {loading ? (
                    <p className="text-center text-gray-600">Loading complaints...</p>
                  ) : (
                    <>
                      {getComplaintsByStatus(activeTab).map((complaint) => {
                        console.log(activeTab);
                        const complaintDate = new Date(complaint.createdAt);
                        const diffDays = Math.floor(
                          (now.getTime() - complaintDate.getTime()) / (1000 * 60 * 60 * 24)
                        );

                        return (
                          <div key={complaint.id} className="border-t border-gray-200">
                            <div className="p-4">
                              <h3 className="text-lg font-bold text-gray-900">{complaint.title}</h3>
                              <p className="text-md text-gray-900">{complaint.description}</p>
                              {activeTab === "all"&& (
                                <p className="mt-2 text-sm text-gray-500">
                                  Status: {complaint.status ? <span className="text-green-600 text-md">Resolved</span> :<span className="text-red-700 text-md">Active</span>}
                                </p>
                              )}
                              {activeTab === "resolved" &&(
                                <p className="mt-2 text-sm text-gray-500">
                                  Status: <span className="text-green-600 text-md">Resolved</span>
                                </p>
                              )}
                              {activeTab === 'active' &&(
                                <p className="mt-2 text-sm text-gray-500">
                                  Status: <span className="text-red-600 text-md">Active</span>
                                </p>
                              )}

                              {activeTab === "active" && diffDays > 3 && (
                                <button
                                  onClick={() => handleRepostComplaint(complaint.id)}
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
