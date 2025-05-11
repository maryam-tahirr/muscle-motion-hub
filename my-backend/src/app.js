
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/index');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const { logRequest } = require('./middlewares/index');
const { createInitialAdminUser } = require('./controllers/index');
require('dotenv').config();
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 5050;

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('Connected to MongoDB');
    // Create initial admin user
    createInitialAdminUser();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Cookie session
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  keys: [process.env.COOKIE_KEY]
}));

// Initialize passport
app.use(passport.initialize());

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? true : 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());
app.use(logRequest);

// API Routes
app.use('/api', routes);

// === Serve Vite Frontend (dist) in Production ===
const rootDir = path.join(__dirname, '../../dist');
app.use(express.static(rootDir));

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
