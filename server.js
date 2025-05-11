// Import required modules
const express = require('express');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, './')));

// Optional: API endpoint to check if server is running
app.get('/ping', (req, res) => {
  res.send('Server is alive!');
});

// Serve index.html for all other routes (for Single-Page Apps)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});