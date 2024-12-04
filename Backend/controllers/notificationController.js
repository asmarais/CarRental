const Notification = require('../models/notifications');
// Add a new notification
exports.addNotification = async (req, res) => {
  try {
    const { user_id, message } = req.body;

    // Create new notification
    const notification = new Notification({
      user_id,
      message,
    });

    await notification.save();
    res.status(201).json({ message: 'Notification added successfully', notification });
  } catch (err) {
    res.status(500).json({ error: 'Error adding notification', details: err.message });
  }
};


// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notification_id } = req.params;

    // Find the notification by notification_id and update the "read" status to true
    const notification = await Notification.findOneAndUpdate(
      { notification_id: notification_id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (err) {
    res.status(500).json({ error: 'Error marking notification as read', details: err.message });
  }
};

// Delete a notification by notification_id
exports.deleteNotification = async (req, res) => {
  try {
    const { notification_id } = req.params;

    // Delete the notification by notification_id
    const notification = await Notification.findOneAndDelete(      { notification_id: notification_id }, // Correct way to query with notification_id
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting notification', details: err.message });
  }
};

// Delete all notifications for a user
exports.deleteAllNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Delete all notifications for a specific user
    const result = await Notification.deleteMany({ user_id : user_id});

    res.status(200).json({ message: 'All notifications deleted successfully', result });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting all notifications', details: err.message });
  }
};

// Get all notifications for a user
exports.getAllNotifications = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Find all notifications for the given user_id
    const notifications = await Notification.find({ user_id:user_id });

    if (notifications.length === 0) {
      return res.status(404).json({ error: 'No notifications found for this user' });
    }

    res.status(200).json({ notifications });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching notifications', details: err.message });
  }
};

// Get a notification by notification_id
exports.getNotificationById = async (req, res) => {
  try {
    const { notification_id } = req.params;

    // Find the notification by notification_id
    const notification = await Notification.findOne({ notification_id :notification_id});

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({ notification });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching notification', details: err.message });
  }
};
exports.getNotificationsWithFilters = async (req, res) => {
  try {
    // Extract query parameters
    const { notification_id, user_id, read, created_at_start, created_at_end } = req.query;

    // Create the filter object for notifications
    const notificationFilters = {};

    // Apply filters if they are provided
    if (notification_id) notificationFilters.notification_id = Number(notification_id);
    if (user_id) notificationFilters.user_id = Number(user_id);
    if (read !== undefined) notificationFilters.read = read === 'true'; // Convert 'true'/'false' string to boolean

    // Filter by creation date range, if provided
    if (created_at_start) {
      const startDate = new Date(created_at_start);
      if (!isNaN(startDate)) {
        notificationFilters.created_at = { $gte: startDate };
      } else {
        return res.status(400).json({ error: 'Invalid created_at_start value' });
      }
    }
    if (created_at_end) {
      const endDate = new Date(created_at_end);
      if (!isNaN(endDate)) {
        // If created_at filter is already present (from start), extend its range
        if (notificationFilters.created_at) {
          notificationFilters.created_at.$lte = endDate;
        } else {
          notificationFilters.created_at = { $lte: endDate };
        }
      } else {
        return res.status(400).json({ error: 'Invalid created_at_end value' });
      }
    }

    // Fetch notifications based on the constructed filters
    const notifications = await Notification.find(notificationFilters);

    // If no notifications are found
    if (notifications.length === 0) {
      return res.status(404).json({ error: 'No notifications found with the specified filters' });
    }

    // Return the found notifications
    return res.status(200).json({ notifications });
  } catch (err) {
    // Handle errors
    return res.status(500).json({ error: 'Error fetching notifications', details: err.message });
  }
};
