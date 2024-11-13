const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use('/api/auth', authRoutes);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
