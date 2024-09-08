"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/Components/Navbar'; // Import Navbar
import Footer from '@/Components/Footer'; // Import Footer
import Chatbot from '@/Components/Chatbot'; // Import Chatbot
import app, { auth, db } from "@/firebase/config"; // Import Firebase config
import { collection, getDocs, getFirestore } from 'firebase/firestore'; // Import Firestore
import { useRouter } from "next/navigation"; // Import Next.js router
import { onAuthStateChanged } from "firebase/auth"; // Import Firebase auth

const firestore = getFirestore(app);

const Home: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]); // State to store posts
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(firestore, 'post');
        const data = await getDocs(postsRef);
        const userRecord = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const formatUserPosts = (rawPosts: any[]): any[] => {
          const combinedPosts = rawPosts.flatMap(user =>
            user.userpost.map((post: any) => ({
              title: post.title,
              description: post.description,
              imageUrl: post.imageUrl,
              createdAt: post.createdAt ?
                new Date(post.createdAt.seconds * 1000).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : 'N/A',
              userId: user.id
            }))
          );
          return combinedPosts;
        };

        const combinedPostsArray = formatUserPosts(userRecord);
        
        // Sort posts by creation date (most recent first)
        combinedPostsArray.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));

        // Get the three most recent posts
        setPosts(combinedPostsArray.slice(0, 3));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Community Posts Section */}
      <CommunityPosts posts={posts} />

      {/* Testimonials Section */}
      <TestimonialsSection />

      <AboutSection />

      

      {/* FAQ Section */}
      <FAQSection />

      {/* Chatbot */}
      <Chatbot />

      {/* Footer */}
      <Footer />
    </div>
  );
};

const HeroSection: React.FC = () => {
  return (
    
    <section
      className="relative bg-cover bg-center h-[70vh] flex items-center justify-center"
      style={{ 
        backgroundImage: 'url(/1.png)', 
        backgroundSize: 'contain', // Adjust background size to fit the image
        backgroundPosition: 'center' // Ensure image is centered
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative text-center">
        <h1 className="text-5xl font-extrabold text-white mb-4">Join Us in Keeping Our City Clean</h1>
        <p className="text-xl text-white mb-6">Make your city a better place with smart garbage detection technology.</p>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg"
          onClick={() => window.location.href = '/complaint'}
        >
          Report a Complaint
        </button>
      </div>
    </section>
  );
};


// Features Section Component
const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Our Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "🚀", title: "Fast Detection", description: "AI-driven fast and accurate garbage and potholes detection." },
            {
              "icon": "🎁",
              "title": "Voucher Redemption",
              "description": "Redeem your points for exciting rewards and discounts."
            },
            
            {
              "icon": "🗨️",
              "title": "Community Posts",
              "description": "Share updates and engage with others to improve the city."
            }
            
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Community Posts Section with Vertical Scroll
const CommunityPosts: React.FC<{ posts: any[] }> = ({ posts }) => {
  return (
    <section className="py-12 px-4 lg:px-16 bg-white">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Latest from the Community</h2>
      <div className="max-w-2xl mx-auto h-96 overflow-y-auto bg-gray-100 p-6 rounded-md shadow-md">
        {posts.map((post, index) => (
          <div key={index} className="bg-white p-4 mb-4 rounded-md shadow">
            <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover rounded-md mb-4" />
            <h3 className="text-xl font-bold text-blue-600">{post.title}</h3>
            <p className="text-gray-600 mb-4">{post.description}</p>
            <span className="text-gray-500">{post.createdAt}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

// Testimonials Section Component
const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Nayan Jindal", feedback: "Fantastic app! The city has never been cleaner." },
            { name: "Jai Bansal", feedback: "Voucher in exchange of points are gamechanger." },
            { name: "Dhruv Tuteja", feedback: "Community tab is just too good." }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-xl text-gray-600 mb-4">"{testimonial.feedback}"</p>
              <h3 className="text-lg font-bold text-gray-800">{testimonial.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Text Section */}
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              About Us
            </h2>
            <p className="mt-6 text-gray-600 text-lg leading-relaxed">
              We are committed to making our cities cleaner and healthier using innovative
              technology. Our platform empowers citizens to report waste issues in real-time,
              and we work alongside local governments to ensure a swift response. Together, 
              we can create a more sustainable future for everyone.
            </p>
          </div>

          {/* Image Section */}
          <div className="mt-8 md:mt-0">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1531973576160-7125cd663d86"
                alt="About Us"
                width={600}
                height={400}
                className="object-cover w-full h-full transform transition duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// FAQ Section Component
const FAQSection: React.FC = () => {
  return (
    <section className="py-16 bg-blue-50">
      <div className="max-w-4xl mx-auto px-4 lg:px-0">
        <h2 className="text-4xl font-bold text-center text-blue-800 mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};
 
// Enhanced FAQ Item Component
const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);
 
  return (
    <div className="border border-gray-300 rounded-lg shadow-sm bg-white">
      <button
        className="w-full text-left p-4 text-gray-900 font-semibold focus:outline-none flex justify-between items-center transition duration-200 ease-in-out"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <svg
          className={`w-5 h-5 text-gray-700 transition-transform duration-300 transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-150 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
      >
        <div className="p-4 text-gray-800 border-t border-gray-300">
          {answer}
        </div>
      </div>
    </div>
  );
};
 
// Sample Data (no change)
const faqData = [
  { question: 'How does garbage and road detection work?', answer: 'We use AI and machine learning models to detect garbage and potholes on streets and notify the cleaning and reparing teams.' },
  { question: 'How can I participate in cleaning?', answer: 'You can join our volunteer program or report garbage through our complaint system.' },
  { question: 'What are the benefits of using this system?', answer: 'It helps in faster garbage disposal, cleaner streets, and a healthier environment.' },
  { question: 'How can I report a complaint?', answer: 'Simply click on the "Report a Complaint" button and fill out the necessary details.' },
];

export default Home;