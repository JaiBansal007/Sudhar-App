"use client";
import { useEffect, useState } from "react";
import app, { auth, db } from "@/firebase/config";
import { collection, query, getDocs, updateDoc, doc, where, getFirestore, getDoc, arrayUnion, increment } from "firebase/firestore"; 
import { toast, Toaster } from "react-hot-toast"; 
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Loading from "../utilities/Loading";
 
const firestore = getFirestore(app);
 
const Buy: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [offers, setOffers] = useState<{ [key: string]: string }>({});
  const [number, setNumber] = useState<number>(0);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [showPaymentPopup, setShowPaymentPopup] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showImagePopup, setShowImagePopup] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [dealerid, setDealerid] = useState<string>("");
 
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
              orderid: post.id,
              title: post.title,
              description: post.description,
              quantity: post.quantity,
              images: post.images,
              price: post.price,
              status: post.status,
              createdAt: post.createdAt,
              state: post.state,
              district: post.district,
              useraddress: post.address,
              dealerid: post.dealerid
              
            }));
          }
          return [];
        });
 
        return combinedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      };
 
      const combinedPostsArray = formatUserPosts(userRecord);
      console.log("Combined posts:", combinedPostsArray);
      setOrders(combinedPostsArray);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
 
  const fetchWalletBalance = async (userId: string) => {
    try {
      const userRef = doc(db, "dealers", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setWalletBalance(userSnap.data().balance || 0);
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };
 
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/trader/signin");
      } else {
        setDealerid(user.uid);
        await fetchWalletBalance(user.uid);
      }
    });
    setLoading(true);
    fetchPosts();
  }, []);
 
  const handleMakePayment = (order: any) => {
    if(order.price*1.05 > walletBalance) {
      toast.error("Insufficient balance for payment!");
      return;
    }
    console.log("Order:", order);
    setSelectedOrder(order);
    setShowPaymentPopup(true);
  };
 
  const handlePaymentSubmit = async () => {
    if (selectedOrder && walletBalance >= selectedOrder.price) {
      const userRef = doc(db, "users", selectedOrder.userid);
      const userSnap = await getDoc(userRef);
      if(userSnap.exists()) {
        const userData = userSnap.data();
        const trading = userData.trading || [];
        const updatedTrading = trading.map((order: any) => {
          if (order.id === selectedOrder.orderid) {
            return {
              ...order,
              status: "payment_done",
            };
          }
          return order;
        });
 
        await updateDoc(userRef, {
          orders: arrayUnion({
            voucherName: selectedOrder.description,
            voucherPrice: selectedOrder.price * 0.95,
            time: new Date().toISOString(),
          }),
          trading: updatedTrading,
          balance: increment(selectedOrder.price * 0.95),
        });
 
        const dealerRef = doc(db, "dealers", dealerid);
        const dealerSnap = await getDoc(dealerRef);
        if(dealerSnap.exists()) {
          await updateDoc(dealerRef, {
            orders: arrayUnion({
              voucherName: selectedOrder.description,
              voucherPrice: -selectedOrder.price*1.05,
              time: new Date().toISOString(),
            }),
            trading: arrayUnion({
              ...selectedOrder,
              status: "payment_done",
            }),
            balance: increment(-selectedOrder.price*(1.05)),
          }).then(() => {
            toast.success("Payment successful!");
            router.push("/trader/order");
          });
        }
        setShowPaymentPopup(false);
        fetchPosts();
      }
    } else {
      toast.error("Insufficient balance for payment!");
    }
  };
 
  const openImagePopup = (index: number) => {
    setCurrentImageIndex(index);
    setShowImagePopup(true);
  };
 
  const closeImagePopup = () => {
    setShowImagePopup(false);
  };
 
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedOrder.images.length);
  };
 
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 +  selectedOrder.images.length) %  selectedOrder.images.length);
  };
 
  if (loading) {
    return <Loading />;
  }
 
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-2 sm:px-4 lg:px-6">
      <div className="w-full max-w-6xl p-4 sm:p-8 space-y-4 sm:space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900">
          View Orders & Submit Offer
        </h2>
 
        {orders.length === 0 ? (
          <p className="text-center text-sm sm:text-base">No orders available.</p>
        ) : (
          orders.map(
            (order) =>
              order.status != "payment_done" &&
              (order.status == "" ? order.dealerid == dealerid : true) && (
                <div key={order.id} className="p-3 sm:p-4 bg-gray-50 rounded-lg shadow">
                  <h3 className="text-lg sm:text-xl font-bold mb-1">{order.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">Description: {order.description}</p>
                  <p className="text-sm sm:text-base text-gray-600">Quantity: {order.quantity}</p>
 
                  <div className="mt-3 sm:mt-4">
                    <h4 className="text-base sm:text-lg font-semibold">User Information</h4>
                    <p className="text-sm sm:text-base text-gray-600">
                      <strong>User Email:</strong> {order.useremail}
                    </p>
                    <p className="text-sm sm:text-base text-gray-600">
                      <strong>Posted On:</strong> {order.createdAt.toDate().toDateString()}
                    </p>
                    <p className="text-sm sm:text-base text-gray-600">
                      <strong>User State:</strong> {order.state}
                    </p>
                    <p className="text-sm sm:text-base text-gray-600">
                      <strong>User District:</strong> {order.district}
                    </p>
                  </div>
 
                  <div className="flex space-x-2 mt-3 sm:mt-4 overflow-x-auto"
                  style={{
                    scrollbarWidth: 'none', // For Firefox
                    msOverflowStyle: 'none', // For Internet Explorer
                  }}>
                    {order.images.map((image: string, index: number) => (
                      <img
                        key={index}
                        src={image}
                        alt="Order"
                        className="w-24 sm:w-24 h-24 sm:h-24 object-cover rounded-lg cursor-pointer"
                        onClick={() => {
                          openImagePopup(index);
                          setSelectedOrder(order);
                        }}
                      />
                    ))}
                  </div>
                  <style jsx>{`
  div::-webkit-scrollbar {
    display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
  }
`}</style>
 
                  <div className="offer-section mt-2 p-3 sm:p-4 rounded-lg bg-white shadow-md">
                    {order.status === "pending" ? (
                      <>
                        <p className="text-green-600 font-semibold text-base sm:text-lg flex justify-between items-center">
                          ✅ Selling Price <span>Amount: {order.price}</span>
                        </p>
                        <button
                          onClick={() => handleMakePayment(order)}
                          className="w-full sm:w-1/4 bg-slate-500 text-white py-2 mt-2 rounded-lg font-semibold hover:bg-slate-800 focus:ring-2 focus:ring-blue-500"
                        >
                          Make Payment
                        </button>
                      </>
                    )  : order.status === "" && (
                      <div className="mt-3 sm:mt-4">
                      </div>
                    )}
                  </div>
                </div>
              )
          )
        )}
 
{showPaymentPopup && selectedOrder && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 max-w-full">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Make Payment</h4>
              <p className="text-gray-700"><strong>Order Amount:</strong> ₹{selectedOrder.price}</p>
              <p className="text-gray-700 mb-2">5% Convenience Fee: ₹{selectedOrder.price*0.05}</p>
              <p className="text-gray-700 mb-2"><strong>Final Order Amount:</strong> ₹{selectedOrder.price*1.05}</p>
              <p className="text-gray-700 mb-2"><strong>Your Wallet Balance:</strong> ₹{walletBalance}</p>
              <p className="text-gray-700 mb-4"><strong>Final Balance After Payment:</strong> ₹{walletBalance - selectedOrder.price*1.05}</p>
              <button
                type="button"
                onClick={handlePaymentSubmit}
                className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600"
              >
                Submit Payment
              </button>
              <button
                type="button"
                onClick={() => setShowPaymentPopup(false)}
                className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
 
        {showImagePopup && selectedOrder && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="relative bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg">
              <img
                src={selectedOrder.images[currentImageIndex]}
                alt="Order Image"
                className="w-full h-auto object-cover rounded-lg mb-4"
              />
              <div className="flex justify-between items-center">
                <button
                  onClick={prevImage}
                  className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none"
                >
                  Previous
                </button>
                <button
                  onClick={closeImagePopup}
                  className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                >
                  Close
                </button>
                <button
                  onClick={nextImage}
                  className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
 
        <Toaster />
      </div>
    </div>
  );
};
 
export default Buy;