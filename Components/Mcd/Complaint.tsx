"use client";
import app, { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, Firestore, getDoc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const firestore=getFirestore(app);
interface Complaint {
  id: string;
  title: string;
  descroption: string;
  location: string;
  status: "active" | "resolved";
  createdAt: string; // Date string
  user: string;
}

const ReceivedComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const router=useRouter();
  const fetchPosts = async () => {
    try {
      // Reference to the 'post' collection
      const postsRef = collection(firestore, 'users');
      const data=await getDocs(postsRef);
    //   // Fetch the documents from the 'post' collection using getDocs
      // console.log(data.docs);
      const userRecord = data.docs.map((doc) => ({
        id: doc.id, // This includes the user's email as the ID
        ...doc.data(), // This spreads out the data fields (e.g., `data`)
    }));
    // console.log(userRecord);
    const formatUserPosts = (rawPosts: any[]): any[] => {
      // Combine all user posts into a single array
      const combinedPosts = rawPosts.flatMap(user => {
          if (user.complaint && user.complaint.length > 0) {
              return user.complaint.map((post: any) => ({
                  id: post.id,
                  title: post.title,
                  description: post.description,
                  location: post.location,
                  status: post.status,
                  createdAt: post.time,
                  userID: user.id,// Handle cases where createdAt might be missing
                  user: user.email, // Optionally include the user ID for reference
                  imageurl: post.imageurl
              }));
          }
          return []; // Return an empty array if no complaints
      });
      return combinedPosts;
  };
  
  // Call the function and set the state
  const combinedPostsArray = formatUserPosts(userRecord);
  setComplaints(combinedPostsArray);
  console.log(combinedPostsArray);    
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  const markAsCompleted = async(props:any) => {
    // Update the status of the complaint to "resolved"
    // Use the complaint ID to update the correct complaint
    try {
      // Reference to the user's document
      const userRef = doc(db, "users", props.userid);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const complaints = userData.complaint || [];
  
        // Find the complaint with the matching complaintID
        const updatedComplaints = complaints.map((complaint: any) => {
          if (complaint.id === props.complaintid) {
            return {
              ...complaint,
              status: complaint.status === "resolved" ? "active" : "resolved", // Toggle between active and resolved
            };
          }
          return complaint; // Return other complaints as they are
        });        
  
        // Update the user's complaint array with the modified complaints
        await updateDoc(userRef, { complaint: updatedComplaints });
        fetchPosts();
        console.log("Complaint status updated to resolved.");
      } else {
        console.log("User not found.");
      }
    } catch (error) {
      console.error("Error resolving complaint:", error);
    }
    
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/mcd/signin");
      }
    });
    fetchPosts(); // Fetch posts when component mounts
  },[]);
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Received Complaints</h1>

      <div className="w-full max-w-3xl space-y-6">
        {complaints.map((complaint:any) => (
          <div
            key={complaint.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-row items-center p-6"
          >
            {/* Complaint Photo */}
            <div className="w-1/3">
              <img
                src={complaint.imageurl}
                alt={complaint.title}
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>

            {/* Complaint Information */}
            <div className="w-2/3 pl-6">
              <h2 className="text-xl font-bold text-gray-900">{complaint.title}</h2>
              <p className="text-gray-600 mt-2">Description: {complaint.description}</p>
              <p className="text-gray-600 mt-2">Location: {complaint.location}</p>
              <p className="text-gray-600 mt-1">User: {complaint.user}</p>
              <p className="text-gray-600 mt-1">Posted At: {complaint.createdAt.substring(0,10)}</p>
              {/* Mark as Completed Button */}
            
                <div className="w-full mt-4 text-center">
                  {(complaint.status === "active") ? (
                    <button
                    onClick={() => markAsCompleted({userid:complaint.userID,complaintid:complaint.id})}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                  >
                   Pending
                  </button>
                  ) : (
                    <button
                      onClick={() => markAsCompleted({ userid: complaint.userID, complaintid: complaint.id })}
                      className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md"
                    >
                      Resolved
                    </button>
                  )}
                </div>

              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceivedComplaints;
