const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const voitureRoutes = require('./routes/carRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const { User, Role } = require('./models/userModel'); 

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Function to create admin if not exists
const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: Role.ADMIN });

    if (!adminExists) {
      const defaultAdmin = new User({
        nom: 'Admin',
        prenom: 'User',
        email: 'admin@gmail.com',
        mot_de_passe: 'admin123', 
        numero_de_telephone: '1234567890',
        adresse: '123 Admin St., Admin City',
        cin: '123456789',
        role: Role.ADMIN,
      });

      // Save the default admin to the database
      await defaultAdmin.save();
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (err) {
    console.error('Error creating admin:', err);
  }
};

// Create default admin on server startup
createAdmin();

// API Routes
app.use('/api/voitures', voitureRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/user', userRoutes);
app.use('/api/paiment', paymentRoutes);

app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
