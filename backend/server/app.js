const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Import review routes (with mongoose models, controllers inside)
const reviewRoutes = require('./routes/reviews');

// Register review routes under /api/reviews
app.use('/api/reviews', reviewRoutes);

// Basic health check
app.get('/', (req, res) => {
  res.send('Flex Living Reviews API is running');
});

// Centralised error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ status: 'error', message: err.message || 'Internal server error' });
});

module.exports = app;
