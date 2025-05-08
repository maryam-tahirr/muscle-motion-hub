const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/index');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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
