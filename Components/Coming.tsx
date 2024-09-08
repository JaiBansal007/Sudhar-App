import React from 'react';
 
const ComingSoon: React.FC = () => {
  const technologies = [
    {
      name: 'Sponsored Cleanup Campaigns',
      description:
        'Partner with brands or large corporations who want to associate themselves with social and environmental causes.',
      icon: 'https://cdn-icons-png.flaticon.com/512/3867/3867424.png',
    },
    {
      name: 'Aadhaar Authentication for Login',
      description:
        'Integrating Aadhaar authentication as a login option on our platform to provide users with a secure and seamless login experience.',
      icon: 'https://cdn-icons-png.flaticon.com/512/3050/3050496.png', // Icon representing secure login or authentication
    },
    
    {
      name: 'Eco-Friendly Product Partnerships',
      description:
        'Partner with companies that sell eco-friendly products (such as reusable bags, composting kits, or electric scooters).',
      icon: 'https://static.vecteezy.com/system/resources/thumbnails/011/468/911/small_2x/eco-friendly-icon-ecologic-food-stamp-organic-natural-healthy-food-product-label-free-vector.jpg',
    },
    {
      name: 'Consulting and Urban Planning Services',
      description:
        'You can offer tailored recommendations on how to improve urban spaces and reduce public infrastructure problems.',
      icon: 'https://cdn-icons-png.freepik.com/512/8151/8151255.png',
    },
  ];
 
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-gray-800 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Exciting Technologies Coming Soon!
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl w-full">
        {technologies.map((tech, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center bg-gray-800 text-white rounded-lg p-6 shadow-lg transition duration-300 hover:scale-105 text-center"
          >
            <img className="text-6xl h-20 mb-4" src={`${tech.icon}`}/>
            <h2 className="text-xl font-bold">{tech.name}</h2>
            <p className="text-center text-sm mt-2">{tech.description}</p>
          </div>
        ))}
      </div>
 
      <div className="mt-12 text-center">
        <p className="text-white text-lg">Stay tuned for more updates!</p>
        <p className="text-gray-400 mt-2">We are working hard to bring these technologies to you.</p>
      </div>
    </div>
  );
};
 
export default ComingSoon;
 
