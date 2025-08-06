import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = ({onUpdate, onNavigate}) => {
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
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load data from backend on component mount
    useEffect(() => {
        loadDataFromBackend();
    }, []);

    const loadDataFromBackend = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/components`);
            const data = response.data;
            
            setFormData({
                header: data.header || { title: '', imageUrl: '' },
                navbar: data.navbar || { links: [
                    {label: '', url: ''},
                    {label: '', url: ''},
                    {label: '', url: ''}
                ]},
                footer: data.footer || { email: '', phone: '', address: '' }
            });
            
            if (data.header?.imageUrl) {
                setImagePreview(data.header.imageUrl);
            }
            
            onUpdate(data);
        } catch (error) {
            console.error('Error loading data from backend:', error);
            // Fall back to localStorage if backend fails
            loadFromLocalStorage();
        } finally {
            setLoading(false);
        }
    };

    const saveDataToBackend = async (dataToSave) => {
        try {
            setSaving(true);
            const response = await axios.post(`${API_BASE_URL}/components`, dataToSave);
            
            if (response.data.success) {
                console.log('Data saved to backend successfully');
                return true;
            }
        } catch (error) {
            console.error('Error saving data to backend:', error);
            throw error;
        } finally {
            setSaving(false);
        }
    };

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

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        // Validate file size (max 5MB)
        const maxSizeInMB = 5;
        if (file.size > maxSizeInMB * 1024 * 1024) {
            alert(`File size must be less than ${maxSizeInMB}MB.`);
            return;
        }

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file); 

        setUploading(true);
        
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        uploadFormData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, 
                uploadFormData
            );
            const imageUrl = response.data.secure_url;
            handleInputChange('header', 'imageUrl', imageUrl);
            setImagePreview(imageUrl);
            console.log('Image uploaded successfully:', imageUrl);
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
            // Save to backend first
            await saveDataToBackend(formData);
            
            // Update parent component
            onUpdate(formData);
            
            // Save to localStorage as backup
            localStorage.setItem('dashboardData', JSON.stringify(formData));
            
            alert("Dashboard settings updated and saved successfully!");
            if (onNavigate) onNavigate('home');
        } catch (error) {
            console.error('Error saving data:', error);
            
            // If backend fails, still update local state and localStorage
            onUpdate(formData);
            localStorage.setItem('dashboardData', JSON.stringify(formData));
            
            alert("Dashboard settings updated locally. Backend save failed - please check your connection.");
            if (onNavigate) onNavigate('home');
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
            onUpdate(data);
            alert("Data loaded from local storage!");
        } else {
            alert("No saved data found in local storage.");
        }
    };



    if (loading) {
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
                onClick={() => onNavigate && onNavigate('home')}
                type="button"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                ← Back to Website
              </button>
              <button
                onClick={loadFromLocalStorage}
                type="button"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Load Local Data
              </button>
        
            </div>
          </div>
          
          {/* Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Use this dashboard to update your website content in real-time. Changes are saved to the database and localStorage for backup.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Header Section */}
            <div className="border-b pb-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">Header Settings</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.header.title}
                    onChange={(e) => handleInputChange('header', 'title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter header title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={uploading}
                  />
                  {uploading && (
                    <div className="flex items-center mt-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      <p className="text-blue-600 text-sm">Uploading image...</p>
                    </div>
                  )}
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            handleInputChange('header', 'imageUrl', '');
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: JPG, PNG, GIF. Max size: 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Navbar Section */}
            <div className="border-b pb-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">Navigation Settings</h2>
              
              {formData.navbar.links.map((link, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link {index + 1} Label
                    </label>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => handleInputChange('navbar', 'label', e.target.value, index)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Enter link ${index + 1} label`}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link {index + 1} URL/Path
                    </label>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => handleInputChange('navbar', 'url', e.target.value, index)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`e.g., /about, /contact, or https://example.com`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Section */}
            <div className="pb-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">Footer Settings</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.footer.email}
                    onChange={(e) => handleInputChange('footer', 'email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.footer.phone}
                    onChange={(e) => handleInputChange('footer', 'phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.footer.address}
                    onChange={(e) => handleInputChange('footer', 'address', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={saving}
                className={`px-8 py-3 rounded-lg font-medium text-lg transition-colors ${
                  saving 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
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