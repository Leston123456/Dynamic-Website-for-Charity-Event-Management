const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const db = require('./event_db');

// Import API routes
const eventsRoutes = require('./api/events');
const categoriesRoutes = require('./api/categories');
const organizationsRoutes = require('./api/organizations');

const app = express();
const PORT = config.server.port || 3000;

// Middleware configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file service
app.use(express.static(path.join(__dirname, 'public')));

// API路由
app.use('/api/events', eventsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/organizations', organizationsRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = await db.testConnection();
    res.json({
      success: true,
      message: 'Service running normally',
      timestamp: new Date().toISOString(),
      database: dbStatus ? 'Connected' : 'Connection failed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Service error',
      error: error.message
    });
  }
});

// Homepage route - serve client HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Search page route
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

// Event details page route
app.get('/event/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'event-details.html'));
});

// 404 handling
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({
      success: false,
      message: 'API endpoint not found'
    });
  } else {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  }
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
  });
});

// Start server
async function startServer() {
  try {
    // Test database connection
    const dbConnected = await db.testConnection();
    if (!dbConnected) {
      console.error('Warning: Database connection failed, server will start but functionality may be limited');
    }
    
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log('🎉 Charity Event Management System Server Started Successfully!');
      console.log(`🌐 Server URL: http://localhost:${PORT}`);
      console.log(`📊 API Endpoints: http://localhost:${PORT}/api`);
      console.log(`💾 Database: ${config.database.host}:3306/${config.database.database}`);
      console.log(`⏰ Start Time: ${new Date().toLocaleString()}`);
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
}

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal, shutting down server...');
  if (db.pool) {
    db.pool.end();
  }
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT signal, shutting down server...');
  if (db.pool) {
    db.pool.end();
  }
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
