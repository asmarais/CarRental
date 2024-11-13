// controllers/notificationController.js
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
      { notification_id: notification_id }, // Correct way to query with notification_id
      { read: true }, // Update the read field to true
      { new: true } // Return the updated notification
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
// Récupérer toutes les notifications avec le filtre `read` uniquement
exports.getNotificationsByStatus = async (req, res) => {
    try {
      const { status } = req.params; // On utilise req.params ici pour récupérer le statut dans l'URL
  
      // Vérifier si le statut est valide (true ou false)
      const isRead = status === 'true'; // Convertir 'true'/'false' en booléen
  
      // Recherche des notifications avec le statut de lecture spécifié
      const notifications = await Notification.find({ read: isRead });
  
      // Si aucune notification n'est trouvée, renvoyer une erreur 404
      if (notifications.length === 0) {
        return res.status(404).json({ error: 'Aucune notification trouvée pour le statut de lecture spécifié' });
      }
  
      // Retourner les notifications trouvées
      return res.status(200).json({ notifications });
  
    } catch (err) {
      // En cas d'erreur, retourner un message d'erreur
      return res.status(500).json({ error: 'Erreur lors de la récupération des notifications', details: err.message });
    }
  };
  