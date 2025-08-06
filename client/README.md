# React Dashboard App with Cloudinary Integration

A dynamic React dashboard application with Tailwind CSS styling, Cloudinary image upload functionality, and MongoDB Atlas integration.

## 🚀 Features

- **Dynamic Content Management**: Edit header, navbar, and footer content in real-time
- **Cloudinary Integration**: Upload and manage images with preview functionality
- **MongoDB Atlas**: Cloud database storage for persistent data
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Local Storage Backup**: Data persistence even when backend is offline
- **Form Validation**: Input validation for all form fields
- **Loading States**: User-friendly loading indicators

## 🛠️ Technology Stack

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **Image Storage**: Cloudinary
- **State Management**: React Context API
- **HTTP Client**: Axios

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Cloudinary account

## ⚙️ Environment Setup

1. **MongoDB Atlas Setup**:
   - Create a MongoDB Atlas cluster
   - Get your connection string
   - Add your connection string to `.env`

2. **Cloudinary Setup**:
   - Create a Cloudinary account
   - Go to Settings → Upload presets
   - Create an unsigned upload preset
   - Add your cloud name and upload preset to `.env`

3. **Environment Variables** (`.env` file):
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   MONGODB_URI=your_mongodb_connection_string
   ```

## 🚀 Installation & Setup

### Option 1: Run Full Stack (Recommended)
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Install concurrently for running both servers
npm install concurrently --save-dev

# Run both frontend and backend
npm run dev:full
```

### Option 2: Run Separately
```bash
# Terminal 1: Start backend server
cd server
npm start

# Terminal 2: Start frontend development server
npm run dev
```

## 📱 Usage

1. **Access the Application**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

2. **Dashboard Features**:
   - **Header Section**: Edit title and upload header image
   - **Navbar Section**: Configure three navigation links (label + URL)
   - **Footer Section**: Update contact information (email, phone, address)

3. **Image Upload**:
   - Click "Choose File" in the Header section
   - Select an image (JPG, PNG, GIF - max 5MB)
   - Preview appears immediately
   - Image uploads to Cloudinary automatically

4. **Data Persistence**:
   - Data saves to MongoDB Atlas when "Update Content" is clicked
   - Local storage backup for offline functionality
   - "Refresh from Server" to reload latest data

## 🗂️ Project Structure

```
react-dashboard-app/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx    # Main dashboard interface
│   │   ├── Header.jsx       # Website header component
│   │   ├── Navbar.jsx       # Navigation component
│   │   └── Footer.jsx       # Footer component
│   ├── context/
│   │   └── DashboardContext.jsx  # Global state management
│   ├── App.jsx             # Main app component
│   └── main.jsx           # App entry point
├── server/
│   ├── server.js          # Express server with MongoDB
│   └── package.json       # Server dependencies
├── .env                   # Environment variables
└── package.json          # Frontend dependencies
```

## 🔧 API Endpoints

- `GET /api/components` - Fetch component data
- `POST /api/components` - Save component data
- `GET /api/health` - Health check

## 🎨 Component Features

### Header Component
- Dynamic title display
- Cloudinary image integration
- Responsive design

### Navbar Component
- Three customizable navigation links
- Hover effects and transitions
- Mobile-responsive layout

### Footer Component
- Contact information display
- Three-column responsive grid
- Email, phone, and address sections

### Dashboard Component
- Form-based content editor
- Image upload with preview
- Real-time validation
- Loading states and error handling

## 🔒 Security Features

- Environment variable protection for API keys
- Input validation and sanitization
- CORS configuration
- Error handling and graceful degradation

## 🚦 Status Indicators

- **Loading States**: Visual feedback during data operations
- **Error Handling**: User-friendly error messages
- **Success Notifications**: Confirmation of successful operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues:

1. **Backend Connection Error**:
   - Check MongoDB Atlas connection string
   - Ensure network access is configured
   - Verify environment variables

2. **Cloudinary Upload Fails**:
   - Check cloud name and upload preset
   - Ensure upload preset is unsigned
   - Verify file size and format

3. **CORS Errors**:
   - Ensure backend server is running
   - Check API endpoint URLs
   - Verify CORS configuration

## 📞 Support

For support and questions, please open an issue in the repository.
