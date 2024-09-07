"use client";

import React from 'react';
import Navbar from '@/Components/Navbar';  // Import Navbar
import Footer from '@/Components/Footer';  // Import Footer

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Content Section */}
      <section className="py-12 px-4 lg:px-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Our Mission for a Cleaner City</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
          We aim to build a sustainable city by using advanced technologies for garbage detection and cleaning. Join our mission to make our environment green and healthy.
        </p>

        {/* FAQ Section */}
        <div className="space-y-4 max-w-2xl mx-auto">
          {faqData.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>

      {/* Community Posts Section */}
      <CommunityPosts />

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
        <h1 className="text-4xl font-bold text-white mb-4">Join Us in Keeping Our City Clean</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
          onClick={() => window.location.href = '/complaint'}
        >
          Report a Complaint
        </button>
      </div>
    </section>
  );
};

// FAQ Component
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

// Community Posts Section
const CommunityPosts: React.FC = () => {
  return (
    <section className="py-12 px-4 lg:px-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Latest from the Community</h2>
      <div className="max-w-4xl mx-auto h-96 overflow-y-scroll bg-gray-100 p-6 rounded-md shadow-md">
        {communityPosts.map((post, index) => (
          <div key={index} className="bg-white p-4 mb-4 rounded-md shadow">
            <h3 className="font-bold text-lg text-blue-600">{post.title}</h3>
            <p className="text-gray-600">{post.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Sample Data
const faqData = [
  { question: 'How does garbage detection work?', answer: 'We use AI and machine learning models to detect garbage on streets and notify the cleaning teams.' },
  { question: 'How can I participate in cleaning?', answer: 'You can join our volunteer program or report garbage through our complaint system.' },
  { question: 'What are the benefits of using this system?', answer: 'It helps in faster garbage disposal, cleaner streets, and a healthier environment.' },
  { question: 'How can I report a complaint?', answer: 'Simply click on the "Report a Complaint" button and fill out the necessary details.' },
];

const communityPosts = [
  { title: 'Volunteer Program Success', content: 'Our recent volunteer program was a great success. Over 200 volunteers participated in cleaning drives.' },
  { title: 'New AI Garbage Detection Model', content: 'We have launched a new AI model that enhances garbage detection accuracy by 30%.' },
  { title: 'Join Our Community Forum', content: 'We encourage everyone to join our community forum to discuss and share ideas for a cleaner city.' },
];

export default Home;
