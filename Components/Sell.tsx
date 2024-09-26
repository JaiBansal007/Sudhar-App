"use client";
import { useState } from "react";
import { db } from "@/firebase/config";
import { collection, addDoc } from "firebase/firestore"; // Firestore functions
import { toast, Toaster } from "react-hot-toast"; // For toaster message

const Sell: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [quantityType, setQuantityType] = useState("number"); // "number" or "weight"
  const [quantity, setQuantity] = useState("");

  // Restrict to image file types and show image preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validImages = files.filter((file) =>
      ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
    );
    if (validImages.length === files.length) {
      setImages((prev) => [...prev, ...validImages]);
    } else {
      toast.error("Only image files (jpg, jpeg, png) are allowed.");
    }
  };

  // Handle image deletion
  const handleDeleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      const orderData = {
        title,
        description,
        quantity,
        images: images.map((img) => img.name), // In a real app, you'll upload these to a storage service like Firebase Storage
        status: "pending", // initial status
        createdAt: new Date(),
      };

      // Add the order to Firestore
      await addDoc(collection(db, "sellOrders"), orderData);

      // Toaster message
      toast.success("Order submitted successfully!");

      // Redirect to the orders page after submission using window.location.href
      window.location.href = "/order"; // Redirect to the orders page
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error submitting the order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Toaster /> {/* Toaster component for displaying notifications */}
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900">Sell Your Scrap</h2>

        {/* Form Fields */}
        <div className="space-y-4">
          <input
            className="w-full p-4 bg-gray-50 rounded-lg"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full p-4 bg-gray-50 rounded-lg"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Image Upload Section */}
          <div className="space-y-2">
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg"
              className="w-full p-4 bg-gray-50 rounded-lg"
              onChange={handleImageUpload}
            />
            <div className="flex flex-wrap gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Uploaded Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <button
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                    onClick={() => handleDeleteImage(index)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity Section */}
          <div className="space-y-2">
            <select
              className="w-full p-4 bg-gray-50 rounded-lg"
              value={quantityType}
              onChange={(e) => setQuantityType(e.target.value)}
            >
              <option value="number">Based on Number</option>
              <option value="weight">Based on Weight</option>
            </select>

            {quantityType === "number" && (
              <select
                className="w-full p-4 bg-gray-50 rounded-lg"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              >
                <option value="" disabled>
                  Select Number
                </option>
                {[...Array(10).keys()].map((n) => (
                  <option key={n + 1} value={n + 1}>
                    {n + 1}
                  </option>
                ))}
              </select>
            )}

            {quantityType === "weight" && (
              <select
                className="w-full p-4 bg-gray-50 rounded-lg"
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

          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sell;
