import { DashboardProvider, useDashboard } from './context/DashboardContext';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

// App Content Component (uses Context)
function AppContent() {
  const { loading, currentPage, componentData, navigateTo } = useDashboard();

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
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Main Content Area</h2>
          <p className="text-gray-600 mb-8">This is your main content. The header, navbar, and footer are dynamically managed through the dashboard.</p>
          
          <button
            onClick={() => navigateTo('dashboard')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Main App Component (provides Context)
function App() {
  return (
    <DashboardProvider>
      <AppContent />
    </DashboardProvider>
  );
}

export default App
