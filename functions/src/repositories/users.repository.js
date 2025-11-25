const { db, auth } = require('../config/firebase');

const usersRepository = {
  // Obtener usuario por ID desde Realtime Database
  getUserById: async (userId) => {
    try {
      const snapshot = await db.ref(`users/${userId}`).once('value');
      
      if (!snapshot.exists()) {
        return null;
      }

      return {
        uid: userId,
        ...snapshot.val()
      };
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }
  },

  // Obtener usuario desde Firebase Auth
  getUserFromAuth: async (userId) => {
    try {
      const userRecord = await auth.getUser(userId);
      return userRecord;
    } catch (_error) {
      return null;
    }
  },

  // Actualizar datos del usuario en Realtime Database
  updateUser: async (userId, updates) => {
    try {
      await db.ref(`users/${userId}`).update({
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  },

  // Actualizar displayName en Firebase Auth
  updateUserAuth: async (userId, displayName) => {
    try {
      await auth.updateUser(userId, { displayName });
    } catch (error) {
      throw new Error(`Error al actualizar usuario en Auth: ${error.message}`);
    }
  }
};

module.exports = usersRepository;