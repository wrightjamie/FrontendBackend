const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database
require('./config/db');

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default
  credentials: true
}));
app.use(express.json());

// Session
const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using https
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
