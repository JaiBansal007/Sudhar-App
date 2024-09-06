"use client";
import React, { useEffect } from 'react'
import { useState } from "react";
export default async function Home(){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);

    const handleImageChange = (e:any) => {
        setImage(e.target.files[0]);
    };
 
    const handleSubmit = (e:any) => {
        e.preventDefault();
        // Handle form submission here
        console.log({ title, description, image });
    };
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
 
        {/* Image Upload Input */}
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
 
        {/* Submit Button */}
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