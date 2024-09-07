"use client";
import Upload from '@/firebase/upload'; // Assuming this uploads the image to Firebase Storage
import React, { useEffect, useState } from "react";
import { auth, db } from "@/firebase/config"; // Import Firestore instance
import { collection, doc, updateDoc, arrayUnion, setDoc, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'firebase/firestore';

export default function Post() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [userId, setUserId] = useState("");
    const router = useRouter();

    const handleImageChange = (e: any) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault(); 
        console.log("Submitting post...");

        try {
            // Upload image to Firebase Storage and get the image URL
            const imageUrl = await Upload(image).then((url) =>{
              console.log(url);
              const userDocRef = doc(db, 'post', userId);

            // Add new post to the user's 'posts' subcollection
            updateDoc(userDocRef, {
              userpost: arrayUnion({
                title: title,
                description: description,
                imageUrl: url,
                createdAt: new Date(),
              })
            }).then(() => {
              toast.success("Post created successfully");
              router.push("/community");
            }).catch((error) => {
              console.error("Error creating post: ", error);
            });
          });

            // toast.success("Post created successfully");
            // console.log("Post created successfully");

        } catch (error) {
            console.error("Error creating post:", error);
            // toast.error("Failed to create post");
        }
    };

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          // Redirect to login page if user is not logged in
          router.push("/login");
        }
      });

      return () => unsubscribe(); // Cleanup on component unmount
    }, []);

    return (
        <div className='flex justify-center items-center h-screen w-screen'>
            <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10 ">
                <h2 className="text-2xl font-semibold text-center mb-6">Create a Post</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Post Title"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Post Description"
                            rows={4}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Upload Image
                        </label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="w-full mt-1 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                            accept="image/*"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
