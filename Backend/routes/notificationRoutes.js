const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const protect = require('../middleware/authMiddleware');


router.post('/', protect, notificationController.addNotification);

router.put('/:notification_id/read', protect, notificationController.markAsRead);

router.delete('/:notification_id', protect, notificationController.deleteNotification);

router.get('/filters', protect, notificationController.getNotificationsWithFilters);

router.delete('/user/:user_id', protect, notificationController.deleteAllNotifications);

router.get('/user/:user_id', protect, notificationController.getAllNotifications);

router.get('/:notification_id', protect, notificationController.getNotificationById);

module.exports = router;
