"use client";
import { useEffect, useState } from "react";
import app,{ auth, db } from "@/firebase/config";
import { collection, query, getDocs, updateDoc, doc, where, getFirestore, getDoc } from "firebase/firestore"; // Firestore functions
import { toast, Toaster } from "react-hot-toast"; // For toaster message
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { title } from "process";
import Loading from "../Loading";

const firestore = getFirestore(app);

const Buy: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [offers, setOffers] = useState<{ [key: string]: string }>({}); // Store offers for each order
  const [number , setNumber] = useState<number>(0);
  const router = useRouter();
  const [loading,setloading] = useState<boolean>(false);
  // Fetch orders from Firestore

  const fetchPosts = async () => {
    try {
      const postsRef = collection(firestore, "users");
      const data = await getDocs(postsRef);
  
      const userRecord = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      const formatUserPosts = (rawPosts: any[]): any[] => {
        const combinedPosts = rawPosts.flatMap((user) => {
          if (user.trading && user.trading.length > 0) {
            return user.trading.map((post: any) => ({
              userid: user.id,
              useremail: user.email,
              orderid:post.id,
              title: post.title,
              description: post.description,
              quantity: post.quantity,
              images: post.images,
              price: post.price,
              status: post.status,
              createdAt: post.createdAt,
              state: post.state,
              district: post.district,
            }));
          }
          return [];
        });
  
        // Sort posts by createdAt field, most recent first
        return combinedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      };
  
      const combinedPostsArray = formatUserPosts(userRecord);
      setOrders(combinedPostsArray);
      setloading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };



  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
      }
    });
      setloading(true);
      fetchPosts();
  }, []);

  // Handle offer submission
  const handleSubmitOffer = async (props: any) => {
    try {
      const userRef = doc(db, "users", props.userid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const complaints = userData.trading || [];
        const updatedComplaints = complaints.map((complaint: any) => {
          if (complaint.id === props.tradingid) {
          
            return {
              ...complaint,
              price: number,
              status:"offer_made", // Toggle between active and resolved
            };
          }
          return complaint;
        });

        await updateDoc(userRef, { trading: updatedComplaints });
        toast.success("Offer submitted successfully!");
      } else {
        console.log("User not found.");
      }
    } catch (error) {
      console.error("Error :", error);
    }
  };
  if(loading){
    return <Loading/>;
  }
  return (
<div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900">View Orders & Submit Offer</h2>

        {orders.length === 0 ? (
          <p className="text-center">No orders available.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="p-4 bg-gray-50 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">{order.title}</h3>
              <p className="text-gray-600">Description: {order.description}</p>
              <p className="text-gray-600">Quantity: {order.quantity}</p>

              {/* Display User Information */}
              <div className="mt-4">
                <h4 className="text-lg font-semibold">User Information</h4>
                <p className="text-gray-600">
                  <strong>User Email:</strong> {order.useremail}
                </p>
                <p className="text-gray-600">
                <strong>Posted On:</strong> {order.createdAt.toDate().toDateString()}
                </p>
                <p className="text-gray-600">
                  <strong>User State:</strong> {order.state}
                </p>
                <p className="text-gray-600">
                  <strong>User District:</strong> {order.district}
                </p>
              </div>

              {/* Display Order Images */}
              <div className="flex space-x-2 mt-4">
                <img
                  key={1}
                  src={order.images.img1}
                  alt={`Preview ${1}`}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <img
                  key={2}
                  src={order.images.img2}
                  alt={`Preview ${2}`}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>

              {/* Offer Submission Section */}
              <div className="mt-6">
                <input
                  type="number"
                  className="w-full p-3 bg-gray-50 rounded-lg"
                  placeholder="Enter offer amount"
                  onChange={(e) => {
                    setNumber(Number(e.target.value));
                  }}
                />
                <button
                  onClick={() => handleSubmitOffer({userid: order.userid, tradingid: order.orderid})}
                  className="mt-4 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-green-600"
                >
                  Submit Offer
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Buy;
