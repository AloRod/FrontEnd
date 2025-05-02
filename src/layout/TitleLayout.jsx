import React from 'react';

const TitleLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-between text-white font-sans">
      <header className="bg-gray-900 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">My Video Platform</h1>
        </div>
      </header>
      <main className="container h-[85vh] p-4">
        {children}
      </main>
    </div>
  );
};

export default TitleLayout;