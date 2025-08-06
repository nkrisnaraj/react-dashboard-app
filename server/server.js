const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

// Import modules
const database = require('./config/db');
const componentsRoutes = require('./routes/componentsRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', componentsRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Connect to database
    await database.connect();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`API endpoints:`);
      console.log(`  GET  /api/components - Get component data`);
      console.log(`  POST /api/components - Save component data`);
      console.log(`  GET  /api/health - Health check`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  try {
    await database.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

startServer();