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

3. **Environment Variables** (`.env` file in root directory):
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   VITE_API_BASE_URL=http://localhost:5000/api
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

## 🚀 Installation & Setup

### Quick Start
```bash
# 1. Copy environment template
cp .env.example .env
# Edit .env with your actual values

# 2. Install frontend dependencies
cd client
npm install
cd ..

# 3. Install backend dependencies
cd server
npm install
cd ..
```

### Running the Application
```bash
# Option 1: Run separately (Recommended)
# Terminal 1: Start backend server
cd server
npm start

# Terminal 2: Start frontend development server
cd client
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
├── .env                     # Environment variables (root level)
├── package.json             # Root package.json for simplified scripts
├── README.md
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── server/                  # Node.js Backend (MVC Architecture)
    ├── config/
    │   └── db.js           # Database configuration singleton
    ├── controllers/
    │   └── componentsController.js  # Business logic
    ├── models/
    │   └── componentsModel.js       # Data access layer
    ├── routes/
    │   └── componentsRoutes.js      # API endpoints
    ├── middleware/
    │   └── errorHandler.js          # Error handling
    ├── server.js           # Entry point
    └── package.json
```

## 🔧 API Endpoints

### Component Management
- `GET /api/components` - Fetch component data
- `POST /api/components` - Save component data

### Health Check
- `GET /api/health` - Server health status

### MVC Architecture
- **Models**: Data access layer with MongoDB operations and validation
- **Controllers**: Business logic and API response handling  
- **Routes**: RESTful endpoint definitions with middleware integration

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
