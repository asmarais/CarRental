// models/notificationModel.js
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Define the notification schema
const notificationSchema = new mongoose.Schema({
   notification_id :{type:Number, unique: true},
  user_id: {type:Number, required: true }, // ID of the user receiving the notification
  message: { type: String, required: true }, // Message content
  read: { type: Boolean, default: false }, // Mark if the notification is read or unread
  created_at: { type: Date, default: Date.now }, // Timestamp when notification was created
});
notificationSchema.plugin(AutoIncrement, { inc_field: 'notification_id' });

// Create and export the Notification model
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
