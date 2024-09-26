"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/config";
import { collection, query, getDocs, updateDoc, doc, where } from "firebase/firestore"; // Firestore functions
import { toast, Toaster } from "react-hot-toast"; // For toaster message
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
const Buy: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [offers, setOffers] = useState<{ [key: string]: string }>({}); // Store offers for each order
  const [number , setNumber] = useState<number>(0);
  const router = useRouter();
  // Fetch orders from Firestore
  useEffect(() => {
    const fetchOrders = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const q = query(collection(db, "sellOrders"));
            const querySnapshot = await getDocs(q);
            const ordersData = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setOrders(ordersData);
          } catch (error) {
            console.error("Error fetching orders: ", error);
            toast.error("Error fetching orders");
          }
        } else {
          router.push("/ngo/signin");
        }
      });
    };

    fetchOrders();
  }, []);

  // Handle offer submission
  const handleSubmitOffer = async (orderId: string) => {

    if (isNaN(Number(number))) {
      toast.error("Please enter a valid offer amount.");
      return;
    }

    try {
      // Update the Firestore document with the dealer's offer

      const ordersCollectionRef = collection(db, "sellOrders");
      const q = query(ordersCollectionRef, where("id", "==", orderId));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => { 
        await updateDoc(doc.ref, {
        price: number,
        status: "offer_made",
      });
      });
      toast.success("Offer submitted successfully!");
    } catch (error) {
      console.error("Error submitting offer: ", error);
      toast.error("Error submitting the offer");
    }

  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Toaster /> {/* Toaster component for displaying notifications */}
      <div className="w-full max-w-6xl p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900">View Orders & Submit Offer</h2>

        {orders.length === 0 ? (
          <p className="text-center">No orders available.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="p-4 bg-gray-50 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">{order.title}</h3>
              <p>{order.description}</p>
              <p>Quantity: {order.quantity}</p>
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
              <div className="mt-6">
                <input
                  type="number"
                  className="w-full p-3 bg-gray-50 rounded-lg"
                  placeholder="Enter offer amount"
                  onChange={(e) =>{
                    setNumber(Number(e.target.value));
                  }}
                />
                <button
                  onClick={() => handleSubmitOffer(order.id)}
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
