import React from 'react';
import { useDashboard } from '../context/DashboardContext';

const Header = () => {
  const { componentData } = useDashboard();
  const { title, imageUrl } = componentData.header;

  return (
    <header className="bg-blue-600 text-white py-8 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        </div>
        {imageUrl && (
          <div className="w-32 h-32 md:w-40 md:h-40">
            <img 
              src={imageUrl} 
              alt="Header Image" 
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
