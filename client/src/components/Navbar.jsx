import React from 'react';
import { useDashboard } from '../context/DashboardContext';

const Navbar = () => {
  const { componentData } = useDashboard();
  const { links } = componentData.navbar;

  const defaultLinks = [
    { label: "Home", url: "/" },
    { label: "About", url: "/about" },
    { label: "Contact", url: "/contact" }
  ];

  const navLinks = links.length > 0 ? links : defaultLinks;

  return (
    <nav className="bg-gray-800 text-white py-4 px-4">
      <div className="container mx-auto">
        <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
          {navLinks.map((link, index) => (
            <li key={index}>
              <a 
                href={link.url}
                className="hover:text-blue-300 transition-colors duration-200 font-medium"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
