"use client";

import React, { useState, useEffect } from "react";
import { deleteUser, getAuth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { toast } from "react-toastify";
interface Complaint {
  id: string;
  title: string;
  photos: string[];
  status: "active" | "resolved" | "user_approved";
  createdAt: string; // Date string
  description: string; // Ensure description is included
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
            console.log(fetchedComplaints);
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
    return complaints.filter(
      (complaint) => status === "all" || complaint.status === status
    );
  };

  const handleRepostComplaint = (id: string) => {
    // Logic to repost complaint
    // window.location.href = /repost-complaint/${id};
  };

  const handleUserApproval = async (id: string, approved: boolean) => {
    try {
      const updatedComplaints:any = complaints.map((complaint) => {
        if (complaint.id === id) {
          return approved
            ? { ...complaint, status: "resolved" }
            : { ...complaint, status: "active" };
        }
        return complaint;
      });
      setComplaints(updatedComplaints);

      const userRef = doc(db, "users", userID);
      await updateDoc(userRef, {
        complaint: updatedComplaints,
      });
    } catch (error) {
      console.error("Failed to update complaint status", error);
    }
  };

  const delet=async()=>{
    const is=confirm("Are you sure you want to delete your account?");
     if(is){
      try {
        const user = getAuth().currentUser;
        if (user) {
          await deleteUser(user);
          toast.success("Account deleted successfully");
          router.push("/signin");
        }
      } catch (error) {
        console.error("Failed to delete account", error);
        toast.error("Failed to delete account. Try again.");
      }
   }
    }
  const handleResolvedClick = async (id: string) => {
    try {
      const updatedComplaints:any = complaints.map((complaint) => {
        if (complaint.id === id) {
          return { ...complaint, status: "resolved", buttonsHidden: true }; // Add flag to hide buttons
        }
        return complaint;
      });
      setComplaints(updatedComplaints);

      const userRef = doc(db, "users", userID);
      await updateDoc(userRef, {
        complaint: updatedComplaints,
      });
    } catch (error) {
      console.error("Failed to update complaint status", error);
    }
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
            <h1 className="text-2xl font-bold text-gray-900">
              {auth.currentUser?.displayName || "User"}
            </h1>
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
            <Link href="/signin">
              <button
                onClick={delet}
                type="button"
                className="w-full bg-slate-500 text-white mt-4 py-2 rounded-lg font-semibold hover:bg-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                Delete Account
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
                      {getComplaintsByStatus(activeTab).map((complaint:any) => {
                        const complaintDate = new Date(complaint.createdAt);
                        const diffDays = Math.floor(
                          (now.getTime() - complaintDate.getTime()) /
                            (1000 * 60 * 60 * 24)
                        );

                        return (
                          <div key={complaint.id} className="border-t border-gray-200">
                            <div className="p-4">
                              {/* Complaint Details */}
                              <h3 className="text-lg font-bold text-gray-900">
                                {complaint.title}
                              </h3>
                              <p className="text-md text-gray-900">
                                {complaint.description}
                              </p>
                              <p className="mt-2 text-sm text-gray-500">
                                Status:{" "}
                                {complaint.status === "resolved" && (
                                  <span className="text-green-600 text-md">Resolved</span>
                                )}
                                {complaint.status === "active" && (
                                  <span className="text-red-700 text-md">Active</span>
                                )}
                              </p>
                              <img
                                src={complaint.imageurl}
                                alt=""
                                className="object-contain w-full mt-4 rounded-lg"
                              />

                              {/* Repost Button for Active Complaints */}
                              {activeTab === "active" && diffDays > 3 && (
                                <button
                                  onClick={() => handleRepostComplaint(complaint.id)}
                                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                                >
                                  Repost Complaint
                                </button>
                              )}

                              {/* User Approval Buttons for Resolved Complaints */}
                              {(activeTab === "resolved" || activeTab === "all") &&
                                complaint.status === "resolved" &&
                                !complaint.buttonsHidden && (
                                  <div className="mt-4 flex space-x-4">
                                    <button
                                      onClick={() => handleResolvedClick(complaint.id)}
                                      className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500"
                                    >
                                      Resolved
                                    </button>
                                    <button
                                      onClick={() => handleUserApproval(complaint.id, false)}
                                      className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500"
                                    >
                                      Not Resolved
                                    </button>
                                  </div>
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
