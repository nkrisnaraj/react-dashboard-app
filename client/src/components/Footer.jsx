import React from 'react';
import { useDashboard } from '../context/DashboardContext';

const Footer = () => {
  const { componentData } = useDashboard();
  const contactInfo = componentData.footer;

  const defaultContact = {
    email: "info@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, City, State 12345"
  };

  const contact = { ...defaultContact, ...contactInfo };

  return (
    <footer className="bg-gray-900 text-white py-8 px-4 mt-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div>
            <h3 className="text-lg font-semibold mb-2">Email</h3>
            <p className="text-gray-300">{contact.email}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Phone</h3>
            <p className="text-gray-300">{contact.phone}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Address</h3>
            <p className="text-gray-300">{contact.address}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
