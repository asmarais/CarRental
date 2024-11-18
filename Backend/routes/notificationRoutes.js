// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Route to add a new notification
router.post('/', notificationController.addNotification);

// Route to mark a notification as read
router.put('/:notification_id/read', notificationController.markAsRead);

// Route to delete a specific notification
router.delete('/:notification_id', notificationController.deleteNotification);
router.get('/filters', notificationController.getNotificationsWithFilters);

// Route to delete all notifications for a user
router.delete('/user/:user_id', notificationController.deleteAllNotifications);
router.get('/user/:user_id', notificationController.getAllNotifications);
router.get('/:notification_id', notificationController.getNotificationById);


module.exports = router;
