// models/notificationModel.js
const mongoose = require('mongoose');

// Define the notification schema
const notificationSchema = new mongoose.Schema({
  user_id: { type: String, required: true }, // ID of the user receiving the notification
  message: { type: String, required: true }, // Message content
  read: { type: Boolean, default: false }, // Mark if the notification is read or unread
  created_at: { type: Date, default: Date.now }, // Timestamp when notification was created
});

// Create and export the Notification model
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
