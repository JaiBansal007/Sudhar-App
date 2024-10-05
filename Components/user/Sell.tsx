"use client";
import { useState,useEffect } from "react";
import { db ,auth } from "@/firebase/config";
import { collection, addDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"; // Firestore functions
import { toast, Toaster } from "react-hot-toast"; // For toaster message
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Upload from '@/firebase/upload'; // Assuming this uploads the image to Firebase Storage
import Loading from "../utilities/Loading";

const statesWithDistricts: { [key: string]: string[] } = {
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
  "Delhi": [
    "Central Delhi",
    "East Delhi",
    "New Delhi",
    "North Delhi",
    "North East Delhi",
    "North West Delhi",
    "Shahdara",
    "South Delhi",
    "South East Delhi",
    "South West Delhi",
    "West Delhi"
  ],
  // Add more states and districts here
};


const Sell: React.FC = () => {
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [quantityType, setQuantityType] = useState("number"); // "number" or "weight"
  const [quantity, setQuantity] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string|null>(null); // State to hold image preview URL
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Restrict to image file types and show image preview
  const handleImageUpload = (e:any) => {
    const file = e.target.files[0];
      setImage((prev)=>[...prev,file]);
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL for the selected image
    setImages((prev) => [...prev, file]);
  };

  // Handle image deletion
  const handleDeleteImage = (index: number) => {
    setImage((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle state change and reset district
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedState = e.target.value;
    setState(selectedState);
    setDistrict(""); // Reset district when state changes
  };

  // Check if all fields are filled
  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Please enter a title.");
      return false;
    }
    if (!description.trim()) {
      toast.error("Please enter a description.");
      return false;
    }
    if (images.length < 2) {
      toast.error("Please upload at least two images.");
      return false;
    }
    if (!quantity.trim()) {
      toast.error("Please select a quantity.");
      return false;
    }
    if (!state.trim()) {
      toast.error("Please select a state.");
      return false;
    }
    if (!district.trim()) {
      toast.error("Please select a district.");
      return false;
    }
    if (!address.trim()) {
      toast.error("Please enter a detailed address.");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e:any) => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }
    
    try {
      setLoading(true);
      const uploadedImages = await Promise.all(
        images.map(async (img: any) => {
          return await Upload(img); // Assuming Upload returns the image URL after uploading
        })
      );
      console.log(uploadedImages);
      const orderData = {
        id: Math.random().toString(36),
        title,
        description,
        quantity,
        images: uploadedImages, // Uploaded image URLs
        status: "pending", // Initial status
        createdAt: new Date(),
        state,
        district,
        address,
        price: 0
      };
      console.log(orderData);
      // Add the order to Firestore
      const user=doc(db,"users",userId);
       const usersnap=await getDoc(user);
        if(usersnap.exists()){
          updateDoc(user,{
            trading:arrayUnion({...orderData})
          });
        };
      setLoading(false);
      // Toaster message
      toast.success("Order submitted successfully!");

      // Redirect to the orders page after submission using window.location.href
      router.push("user/order");
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error submitting the order");
    }
  };



    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          // Redirect to login page if user is not logged in
          router.push("/signin");
        }
      });
      
    }, []);
    if(loading){
      return <Loading />;
    }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Toaster /> {/* Toaster component for displaying notifications */}
      <div className="w-full max-w-4xl p-10 space-y-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-4xl font-extrabold text-gray-900">Sell Your Scrap</h2>

        {/* Form Fields */}
        <div className="space-y-6">
          <input
            className="w-full p-4 bg-gray-50 rounded-lg border border-gray-300"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full p-4 bg-gray-50 rounded-lg border border-gray-300"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          
          <div className="space-y-0">
            <div className="w-auto py-4 bg-gray-50 rounded-lg border border-gray-300 flex items-center md:pl-4">
              <input
                type="file"
                multiple
                accept="image/png, image/jpeg, image/jpg"
                className="cursor-pointer rounded-lg"
                onChange={handleImageUpload}
              />
            </div>
            <div className="flex flex-wrap gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Uploaded Preview"
                    className="w-32 h-32 mt-2 object-cover rounded-lg shadow-lg"
                  />
                  <button
                    className="absolute top-2 right-1 bg-red-500 text-white p-1 rounded-full"
                    onClick={() => handleDeleteImage(index)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity Section */}
          <div className="space-y-4">
            <select
              className="w-full p-4 bg-gray-50 rounded-lg border border-gray-300"
              value={quantityType}
              onChange={(e) => setQuantityType(e.target.value)}
            >
              <option value="number">Based on Number</option>
              <option value="weight">Based on Weight</option>
            </select>

            {quantityType === "number" && (
              <select
                className="w-full p-4 bg-gray-50 rounded-lg border border-gray-300"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              >
                <option value="" disabled>
                  Select Number
                </option>
                {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            )}

            {quantityType === "weight" && (
              <select
                className="w-full p-4 bg-gray-50 rounded-lg border border-gray-300"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              >
                <option value="" disabled>
                  Select Weight
                </option>
                <option value="100g">100g</option>
                <option value="500g">500g</option>
                <option value="1kg">1kg</option>
                <option value="5kg">5kg</option>
                <option value="10kg">10kg</option>
              </select>
            )}
          </div>

          {/* Address Section */}
          <div className="space-y-4 sm:space-y-0 sm:flex sm:gap-6">
            <select
              className="w-full p-4 bg-gray-50 rounded-lg border border-gray-300"
              value={state}
              onChange={handleStateChange}
            >
              <option value="" disabled>
                Select State
              </option>
              {Object.keys(statesWithDistricts).map((stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName}
                </option>
              ))}
            </select>

            {state && (
              <select
                className="w-full p-4 bg-gray-50 rounded-lg border border-gray-300"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="" disabled>
                  Select District
                </option>
                {statesWithDistricts[state].map((districtName) => (
                  <option key={districtName} value={districtName}>
                    {districtName}
                  </option>
                ))}
              </select>
            )}
          </div>

          <input
            className="w-full p-4 bg-gray-50 rounded-lg border border-gray-300"
            type="text"
            placeholder="Detailed Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          className="w-full py-4 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Sell;
