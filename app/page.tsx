"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar'; // Import Navbar
import Footer from '@/components/Footer'; // Import Footer
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

      {/* Pricing Section */}
      <PricingSection />

      {/* Newsletter Subscription Section */}
      <NewsletterSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Hero Section Component
const HeroSection: React.FC = () => {
  return (
    <section
      className="relative bg-cover bg-center h-[70vh] flex items-center justify-center"
      style={{ backgroundImage: 'url(/hero-image.jpg)' }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center">
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
            { icon: "🚀", title: "Fast Detection", description: "AI-driven fast and accurate garbage detection." },
            { icon: "🔍", title: "Real-Time Monitoring", description: "Monitor city cleanliness in real-time." },
            { icon: "📈", title: "Data Analytics", description: "Advanced analytics for cleaner city planning." }
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
            { name: "John Doe", feedback: "Fantastic app! The city has never been cleaner." },
            { name: "Jane Smith", feedback: "Real-time monitoring is a game-changer!" },
            { name: "Michael Lee", feedback: "Data analytics have greatly improved our city's cleanliness strategy." }
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

// Pricing Section Component
const PricingSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">Our Pricing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { plan: "Basic", price: "$9.99", features: ["Feature 1", "Feature 2", "Feature 3"] },
            { plan: "Pro", price: "$19.99", features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"] },
            { plan: "Enterprise", price: "Contact Us", features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"] }
          ].map((pricing, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{pricing.plan}</h3>
              <p className="text-xl text-gray-600 mb-4">{pricing.price}</p>
              <ul className="text-gray-600 mb-4">
                {pricing.features.map((feature, idx) => (
                  <li key={idx} className="mb-2">{feature}</li>
                ))}
              </ul>
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Choose Plan</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Newsletter Subscription Section Component
const NewsletterSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-3xl mx-auto px-4 lg:px-0 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Subscribe to Our Newsletter</h2>
        <p className="text-lg text-gray-600 mb-6">Stay updated with the latest news and offers.</p>
        <input
          type="email"
          className="border border-gray-300 p-3 rounded-lg w-full mb-4"
          placeholder="Enter your email"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg">Subscribe</button>
      </div>
    </section>
  );
};

// FAQ Section Component
const FAQSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-2xl mx-auto px-4 lg:px-0">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

// FAQ Item Component
const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border border-gray-200 rounded-md">
      <button
        className="w-full text-left p-4 text-gray-800 font-medium focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
      </button>
      {isOpen && (
        <div className="p-4 text-gray-600 border-t border-gray-200">
          {answer}
        </div>
      )}
    </div>
  );
};

// Sample Data
const faqData = [
  { question: 'How does garbage detection work?', answer: 'We use AI and machine learning models to detect garbage on streets and notify the cleaning teams.' },
  { question: 'How can I participate in cleaning?', answer: 'You can join our volunteer program or report garbage through our complaint system.' },
  { question: 'What are the benefits of using this system?', answer: 'It helps in faster garbage disposal, cleaner streets, and a healthier environment.' },
  { question: 'How can I report a complaint?', answer: 'Simply click on the "Report a Complaint" button and fill out the necessary details.' },
];

export default Home;
