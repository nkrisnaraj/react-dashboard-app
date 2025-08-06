import { useEffect, useState } from 'react'
import axios from 'axios'

import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [componentData, setComponentData] = useState({
    header: {
      title: 'Welcome to My Website',
      imageUrl: ''
    },
    navbar: {
      links: [
        { label: 'Home', url: '/' },
        { label: 'About', url: '/about' },
        { label: 'Contact', url: '/contact' }
      ]
    },
    footer: {
      email: 'info@example.com',
      phone: '123-456-7890',
      address: '123 Main St, Jaffna, Sri Lanka'
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/components`);
      setComponentData(response.data);
    } catch (error) {
      console.error('Error loading data from backend:', error);
      // Fall back to localStorage if backend fails
      const savedData = localStorage.getItem('dashboardData');
      if (savedData) {
        setComponentData(JSON.parse(savedData));
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleDataUpdate = (newData) => {
    setComponentData(newData);
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (currentPage === 'dashboard') {
    return <Dashboard onUpdate={handleDataUpdate} onNavigate={handleNavigation} />;
  }

  return (

    <div className=" min-h-screen flex flex-col">
      <Header
        title={componentData.header.title}
        imageUrl={componentData.header.imageUrl}
      />
      <Navbar links={componentData.navbar.links} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Main Content Area</h2>
          <p className="text-gray-600 mb-8">This is your main content. The header, navbar, and footer are dynamically managed through the dashboard.</p>
          
          <button
            onClick={() => handleNavigation('dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </main>

      <Footer contactInfo={componentData.footer} />

    </div>
  );
}

export default App
