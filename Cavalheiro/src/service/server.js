const path = require('path');
const express = require('express');

const authRoutes = require('../routes/auth.routes');

const app = express();

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, '..', '..')));

// Routes
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

