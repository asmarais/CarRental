// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import config, routes, and middleware
const connectDB = require('./config/db');
const itemRoutes = require('./routes/itemRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/items', itemRoutes);
// Importation des routes
const voitureRoutes = require('./routes/carRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const userRoutes = require('./routes/itemRoutes');

// API Routes
app.use('/api/voitures', voitureRoutes);  // Route pour les voitures
app.use('/api/reservations', reservationRoutes);  // Route pour les réservations
app.use('/api/users', userRoutes);  // Route pour les utilisateurs


// Error Handling Middleware
app.use(errorHandler);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
