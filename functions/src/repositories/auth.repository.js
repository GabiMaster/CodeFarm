const { auth, db } = require('../config/firebase');

const authRepository = {
  // Crear usuario en Firebase Auth
  createUser: async ({ email, password, displayName }) => {
    try {
      const userRecord = await auth.createUser({
        email,
        password,
        displayName
      });
      return userRecord;
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  },

  // Guardar datos adicionales en Realtime Database
  saveUserData: async (uid, userData) => {
    try {
      await db.ref(`users/${uid}`).set(userData);
    } catch (error) {
      throw new Error(`Error al guardar datos del usuario: ${error.message}`);
    }
  },

  // Buscar usuario por email en Realtime Database
  findUserByEmail: async (email) => {
    try {
      const snapshot = await db.ref('users')
        .orderByChild('email')
        .equalTo(email)
        .once('value');
      
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error.message}`);
    }
  },

  // Buscar usuario por username en Realtime Database
  findUserByUsername: async (username) => {
    try {
      const snapshot = await db.ref('users')
        .orderByChild('username')
        .equalTo(username)
        .once('value');
      
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      throw new Error(`Error al buscar usuario por username: ${error.message}`);
    }
  },

  // Obtener usuario de Firebase Auth por email
  getUserByEmail: async (email) => {
    try {
      const userRecord = await auth.getUserByEmail(email);
      return userRecord;
    } catch (_error) {
      return null;
    }
  },

  // Verificar contraseña (usando custom tokens)
  verifyPassword: async (email) => {
    try {
      // Firebase Admin SDK no puede verificar contraseñas directamente
      // Esta función será usada con Firebase Client SDK en el frontend
      // Aquí solo validamos que el usuario existe
      const userRecord = await auth.getUserByEmail(email);
      return userRecord;
    } catch (_error) {
      return null;
    }
  },

  // Actualizar contraseña
  updatePassword: async (uid, newPassword) => {
    try {
      await auth.updateUser(uid, { password: newPassword });
    } catch (error) {
      throw new Error(`Error al actualizar contraseña: ${error.message}`);
    }
  },

  // Obtener datos del usuario desde Realtime Database
  getUserData: async (uid) => {
    try {
      const snapshot = await db.ref(`users/${uid}`).once('value');
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      throw new Error(`Error al obtener datos del usuario: ${error.message}`);
    }
  },

  // Crear custom token para autenticación
  createCustomToken: async (uid) => {
    try {
      const customToken = await auth.createCustomToken(uid);
      return customToken;
    } catch (error) {
      throw new Error(`Error al crear token: ${error.message}`);
    }
  },

  // Actualizar datos del usuario en Realtime Database
  updateUserData: async (uid, updates) => {
    try {
      await db.ref(`users/${uid}`).update(updates);
    } catch (error) {
      throw new Error(`Error al actualizar datos del usuario: ${error.message}`);
    }
  }
};

module.exports = authRepository;