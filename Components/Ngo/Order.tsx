"use client";
import { useEffect, useState } from "react";
import app, { auth, db } from "@/firebase/config";
import { arrayUnion, collection, doc, getDoc, getDocs, getFirestore, updateDoc } from "firebase/firestore"; // Firestore functions
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Loading from "../Loading";

const firestore = getFirestore(app);

const PastOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [userid, setUserid] = useState<string>("");
  const fetchPaidOrders = async (props:any) => {
    try {
        const dealerdoc=await getDoc(doc(db,"dealers",props ));
        if(dealerdoc.exists()){
          const dealerdata=dealerdoc.data();
          if(dealerdata){
            const orders=dealerdata["trading"];
            setOrders(orders);
          }
        }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/ngo/signin");
      }else{
        setUserid(user.uid);
        fetchPaidOrders(user.uid);

      }
    });
    setLoading(true);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900">Paid Orders</h2>

        {orders.length === 0 ? (
          <p className="text-center">No paid orders available.</p>
        ) : (
          orders.map((order) =>order.status=="payment_done"&&(
            <div key={order.id} className="p-4 bg-gray-50 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-2">{order.title}</h3>
              <p className="text-gray-600">Description: {order.description}</p>
              <p className="text-gray-600">Quantity: {order.quantity}</p>

              {/* Display User Information */}
              <div className="mt-4">
                <h4 className="text-lg font-semibold">User Information</h4>
                <p className="text-gray-600"><strong>User Email:</strong> {order.useremail}</p>
                <p className="text-gray-600"><strong>Posted On:</strong> {order.createdAt.toDate().toDateString()}</p>
                <p className="text-gray-600"><strong>User State:</strong> {order.state}</p>
                <p className="text-gray-600"><strong>User District:</strong> {order.district}</p>
                <p className="text-gray-600 text-2xl"><strong>Detailed Address:</strong> {order.useraddress}</p>
              </div>

              {/* Display Order Images */}
              <div className="flex space-x-2 mt-4">
                <img key={1} src={order.images.img1} alt={`Preview ${1}`} className="w-32 h-32 object-cover rounded-lg" />
                <img key={2} src={order.images.img2} alt={`Preview ${2}`} className="w-32 h-32 object-cover rounded-lg" />
              </div>

              {/* Display Order Status */}
              <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
                <p className="text-gray-600"><strong>Status:</strong> {order.status}</p>
                <p className="text-gray-600"><strong>Price:</strong> ₹{order.price}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PastOrders;
