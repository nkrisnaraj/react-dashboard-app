import React, { useState, useEffect } from "react";
import { useDashboard } from '../context/DashboardContext';

const Dashboard = () => {
    const { 
        componentData, 
        loading: contextLoading, 
        saveData, 
        navigateTo,
        loadInitialData 
    } = useDashboard();

    const [formData, setFormData] = useState({
        header:{
            title: '',
            imageUrl: '',
        },
        navbar: {
            links:[
                {label: '', url: ''},
                {label: '', url: ''},
                {label: '', url: ''}
            ]
        },
        footer: {
            email: '',
            phone: '',
            address: ''
        }
    });
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [saving, setSaving] = useState(false);

    // Load data from context on component mount
    useEffect(() => {
        if (componentData) {
            setFormData({
                header: componentData.header || { title: '', imageUrl: '' },
                navbar: componentData.navbar || { links: [
                    {label: '', url: ''},
                    {label: '', url: ''},
                    {label: '', url: ''}
                ]},
                footer: componentData.footer || { email: '', phone: '', address: '' }
            });
            setImagePreview(componentData.header?.imageUrl || '');
        }
    }, [componentData]);

    const handleInputChange = (section, field, value, index = null) => {
        setFormData(prev =>{
            const newData = {...prev};

            if (section === 'navbar' && index !== null) {
                newData[section].links[index][field] = value;
            } else {
                newData[section][field] = value;
            }
            return newData;
        });
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // File validation
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            alert('Please select a valid image file (JPG, PNG, or GIF).');
            return;
        }

        if (file.size > maxSize) {
            alert('Image size must be less than 5MB.');
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
            
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.secure_url) {
                setImagePreview(data.secure_url);
                handleInputChange('header', 'imageUrl', data.secure_url);
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image. Please try again.");
            setImagePreview(''); // Clear preview on error
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.header.title.trim()) {
            alert('Please enter a header title.');
            return;
        }
        
        // Validate navbar links
        const hasEmptyLinks = formData.navbar.links.some(link => 
            !link.label.trim() || !link.url.trim()
        );
        if (hasEmptyLinks) {
            alert('Please fill in all navigation link labels and paths/URLs.');
            return;
        }
        
        // Validate navbar URL/path format (allow both paths and full URLs)
        const invalidUrls = formData.navbar.links.some(link => {
            const url = link.url.trim();
            if (url.startsWith('/') || url.startsWith('#')) {
                // Valid path or anchor
                return false;
            }
            // Check if it's a valid URL
            try {
                new URL(url);
                return false;
            } catch {
                // Not a valid URL, check if it's a relative path
                return !url.match(/^[a-zA-Z0-9\-_\.\/]+$/);
            }
        });
        
        if (invalidUrls) {
            alert('Please enter valid paths (e.g., /about) or URLs (e.g., https://example.com) for navigation links.');
            return;
        }
        
        // Validate footer info
        if (!formData.footer.email.trim() || !formData.footer.phone.trim() || !formData.footer.address.trim()) {
            alert('Please fill in all footer contact information.');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.footer.email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        try {
            setSaving(true);
            // Save using context
            const result = await saveData(formData);
            
            if (result.success) {
                // Also save to localStorage for backup
                localStorage.setItem('dashboardData', JSON.stringify(formData));
                alert("Dashboard settings updated and saved successfully!");
                navigateTo('home');
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error saving data:', error);
            
            // Save to localStorage as backup
            localStorage.setItem('dashboardData', JSON.stringify(formData));
            
            alert("Dashboard settings updated locally. Backend save failed - please check your connection.");
            navigateTo('home');
        } finally {
            setSaving(false);
        }
    };

    const loadFromLocalStorage = () => {
        const savedData = localStorage.getItem('dashboardData');
        if (savedData) {
            const data = JSON.parse(savedData);
            setFormData(data);
            if (data.header.imageUrl) {
                setImagePreview(data.header.imageUrl);
            }
            alert("Data loaded from local storage!");
        } else {
            alert("No saved data found in local storage.");
        }
    };

    if (contextLoading) {
        return (
            <div className="bg-gray-100 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return(
        <div className="bg-gray-100 min-h-screen py-8">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                  <p className="text-gray-600 mt-1">Manage your website content dynamically</p>
                </div>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                  <button
                    onClick={() => navigateTo('home')}
                    type="button"
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    ← Back to Website
                  </button>
                  <button
                    onClick={loadFromLocalStorage}
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    💾 Load Local Data
                  </button>
                </div>
              </div>
              
              {/* Instructions */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
                <div className="flex">
                  <div>
                    <h3 className="text-blue-800 font-medium">How to use this Dashboard:</h3>
                    <p className="text-blue-700 text-sm mt-1">
                      Edit the content below and click "Update Content" to save changes to your website. 
                      Use "Load Local Data" to restore previously saved data from your browser.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Header Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Header Section</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="headerTitle" className="block text-sm font-medium text-gray-700 mb-2">
                        Website Title *
                      </label>
                      <input
                        type="text"
                        id="headerTitle"
                        value={formData.header.title}
                        onChange={(e) => handleInputChange('header', 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your website title"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="headerImage" className="block text-sm font-medium text-gray-700 mb-2">
                        Header Image
                      </label>
                      <input
                        type="file"
                        id="headerImage"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={handleImageUpload}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        disabled={uploading}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Upload a header image (JPG, PNG, or GIF - max 5MB)
                      </p>

                      {uploading && (
                        <div className="mt-3 text-blue-600 flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          Uploading image...
                        </div>
                      )}

                      {imagePreview && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                          <img 
                            src={imagePreview} 
                            alt="Header preview" 
                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navbar Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Navigation Menu</h2>
                  
                  {formData.navbar.links.map((link, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor={`navLabel${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                          Link {index + 1} Label *
                        </label>
                        <input
                          type="text"
                          id={`navLabel${index}`}
                          value={link.label}
                          onChange={(e) => handleInputChange('navbar', 'label', e.target.value, index)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Link ${index + 1} text`}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`navUrl${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                          Link {index + 1} Path/URL *
                        </label>
                        <input
                          type="text"
                          id={`navUrl${index}`}
                          value={link.url}
                          onChange={(e) => handleInputChange('navbar', 'url', e.target.value, index)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., /about or https://example.com"
                          required
                        />
                      </div>
                    </div>
                  ))}
                  
                  <p className="text-sm text-gray-500 mt-2">
                    Enter paths (e.g., /about, #contact) or full URLs (e.g., https://example.com)
                  </p>
                </div>

                {/* Footer Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Footer Contact Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="footerEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="footerEmail"
                        value={formData.footer.email}
                        onChange={(e) => handleInputChange('footer', 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="footerPhone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="footerPhone"
                        value={formData.footer.phone}
                        onChange={(e) => handleInputChange('footer', 'phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="footerAddress" className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        id="footerAddress"
                        value={formData.footer.address}
                        onChange={(e) => handleInputChange('footer', 'address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="123 Main St, City, State"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={uploading || saving}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-2 focus:ring-2 focus:outline-none transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? 'Saving...' : 'Update Content'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
    );
};

export default Dashboard;
