const { db } = require('../config/firebase');

const notificationsRepository = {
  // Obtener notificaciones por usuario
  getNotificationsByUser: async (userId) => {
    try {
      const snapshot = await db.ref('notifications')
        .orderByChild('userId')
        .equalTo(userId)
        .once('value');
      
      if (!snapshot.exists()) {
        return [];
      }

      const notifications = [];
      snapshot.forEach((childSnapshot) => {
        notifications.push({
          notificationId: childSnapshot.key,
          ...childSnapshot.val()
        });
      });

      // Ordenar por fecha (más recientes primero)
      notifications.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );

      return notifications;
    } catch (error) {
      throw new Error(`Error al obtener notificaciones: ${error.message}`);
    }
  },

  // Crear notificación (para uso interno)
  createNotification: async (notificationData) => {
    try {
      const newNotificationRef = db.ref('notifications').push();
      await newNotificationRef.set(notificationData);
      return newNotificationRef.key;
    } catch (error) {
      throw new Error(`Error al crear notificación: ${error.message}`);
    }
  },

  // Marcar notificación como leída
  markAsRead: async (notificationId) => {
    try {
      await db.ref(`notifications/${notificationId}`).update({
        read: true,
        readAt: new Date().toISOString()
      });
    } catch (error) {
      throw new Error(`Error al marcar notificación como leída: ${error.message}`);
    }
  }
};

module.exports = notificationsRepository;