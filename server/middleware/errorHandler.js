// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error stack:', err.stack);
  
  // Default error
  let error = {
    message: err.message || 'Something went wrong!',
    status: err.status || 500
  };

  // MongoDB validation error
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map(val => val.message).join(', ');
    error.status = 400;
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    error.message = 'Resource already exists';
    error.status = 400;
  }

  // MongoDB cast error
  if (err.name === 'CastError') {
    error.message = 'Invalid ID format';
    error.status = 400;
  }

  res.status(error.status).json({
    error: error.message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  });
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.method} ${req.originalUrl} does not exist`,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
