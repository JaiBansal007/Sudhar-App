import React from 'react';

const ComingSoon: React.FC = () => {
  const technologies = [
    {
      name: 'Artificial Intelligence',
      description:
        'AI is reshaping industries with its ability to automate tasks, analyze data, and make predictions.',
      icon: '🤖',
    },
    {
      name: 'Quantum Computing',
      description:
        'Quantum computing offers the potential to solve complex problems far beyond the capabilities of classical computers.',
      icon: '⚛️',
    },
    {
      name: 'Blockchain',
      description:
        'Blockchain technology is providing security and transparency in digital transactions.',
      icon: '🔗',
    },
    {
      name: '5G Connectivity',
      description:
        '5G technology is revolutionizing the way we connect, providing faster speeds and more reliable connections.',
      icon: '📶',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-gray-800 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Exciting Technologies <br /> Coming Soon!
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl w-full">
        {technologies.map((tech, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center bg-gray-800 text-white rounded-lg p-6 shadow-lg transition duration-300 hover:scale-105"
          >
            <div className="text-6xl mb-4">{tech.icon}</div>
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
