"use client";
import { useEffect, useState } from "react";
import { db ,auth} from "@/firebase/config";
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from "firebase/firestore"; // Firestore functions
import { toast, Toaster } from "react-hot-toast"; // For toaster message
import {useRouter} from 'next/navigation';
import { onAuthStateChanged } from "firebase/auth";
import { set } from "firebase/database";
import Loading from "./Loading";
const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [userid, setUserid] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  // Fetch user's orders from Firestore
  useEffect(() => {
    const fetchDetails = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserid(user.uid);
          try {
            const userdata=doc(db,"users",user.uid);
            const usersnap=await getDoc(userdata);
            if(usersnap){
              const data=usersnap.data();
              if(data){
                setOrders(data["trading"]);
              }
            }
            setLoading(false);
          } catch (error) {
            console.error("Error fetching orders: ", error);
            toast.error("Error fetching orders");
          }
        } else {
          router.push("/signin");
        }
      });
    };
    fetchDetails();
  }, []);

  // Handle Accept or Reject Offer
  const handleResponse = async (orderId: string, status: "accepted" | "rejected") => {
    try {
      const updatedtrading:any=orders.map((order) =>{
        if(order.id===orderId){
          return {...order,status};
        }
        return order;
      });
      setOrders(updatedtrading);
      const orderRef = doc(db, "users", userid);
      await updateDoc(orderRef, {
        trading: updatedtrading,
      });
      console.log("Order updated successfully!");
      toast.success(`Offer ${status === "accepted" ? "accepted" : "rejected"} successfully!`);
    } catch (error) {
      console.error("Error updating order: ", error);
      toast.error("Error updating the order");
    }
  };

  if(loading){
    return <Loading/>;
  }
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Toaster /> {/* Toaster component for displaying notifications */}
      <div className="w-full max-w-6xl p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900">Your Orders</h2>

        {orders.length === 0 ? (
          <p className="text-center">No orders available.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="p-4 bg-gray-50 rounded-lg shadow space-y-4">
              <h3 className="text-xl font-bold">{order.title}</h3>
              <p>{order.description}</p>
              <p>Quantity: {order.quantity}</p>
              {/* <p>{order.images[0]}</p> */}

              <div className="flex space-x-2 mt-4">
              <img
                    key={1}
                    src={order.images.img1} // Replace this with the correct image handling logic if needed
                    alt={`Preview ${1}`}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <img
                    key={2}
                    src={order.images.img2} // Replace this with the correct image handling logic if needed
                    alt={`Preview ${2}`}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
              </div>

              {order.status === "pending" ? (
                <p className="text-yellow-500 font-semibold">Waiting for Dealer Offer</p>
              ) : order.status === "offer_made" ? (
                <div className="space-y-4">
                  <p className="text-green-500 font-semibold">
                    Dealer's Offer: ₹{order.price}
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleResponse(order.id, "accepted")}
                      className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-600"
                    >
                      Accept Offer
                    </button>
                    <button
                      onClick={() => handleResponse(order.id, "rejected")}
                      className="bg-red-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-red-600"
                    >
                      Reject Offer
                    </button>
                  </div>
                </div>
              ) : order.status === "accepted" ? (
                <p className="text-green-500 font-semibold">Offer Accepted</p>
              ) : order.status === "rejected" ? (
                <p className="text-red-500 font-semibold">Offer Rejected</p>
              ) : order.status === "payment_done" ? (
                <p className="text-green-500 font-semibold">Payment Done</p>):null}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
