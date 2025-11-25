const { db } = require('../config/firebase');

const filesRepository = {
  // Crear archivo
  createFile: async (fileData) => {
    try {
      const newFileRef = db.ref('files').push();
      await newFileRef.set(fileData);
      return newFileRef.key;
    } catch (error) {
      throw new Error(`Error al crear archivo: ${error.message}`);
    }
  },

  // Obtener archivos por proyecto
  getFilesByProject: async (projectId) => {
    try {
      const snapshot = await db.ref('files')
        .orderByChild('projectId')
        .equalTo(projectId)
        .once('value');
      
      if (!snapshot.exists()) {
        return [];
      }

      const files = [];
      snapshot.forEach((childSnapshot) => {
        files.push({
          fileId: childSnapshot.key,
          ...childSnapshot.val()
        });
      });

      return files;
    } catch (error) {
      throw new Error(`Error al obtener archivos del proyecto: ${error.message}`);
    }
  },

  // Obtener archivo por ID
  getFileById: async (fileId) => {
    try {
      const snapshot = await db.ref(`files/${fileId}`).once('value');
      
      if (!snapshot.exists()) {
        return null;
      }

      return {
        fileId: snapshot.key,
        ...snapshot.val()
      };
    } catch (error) {
      throw new Error(`Error al obtener archivo: ${error.message}`);
    }
  },

  // Actualizar archivo
  updateFile: async (fileId, updates) => {
    try {
      await db.ref(`files/${fileId}`).update({
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      throw new Error(`Error al actualizar archivo: ${error.message}`);
    }
  },

  // Eliminar archivo
  deleteFile: async (fileId) => {
    try {
      await db.ref(`files/${fileId}`).remove();
    } catch (error) {
      throw new Error(`Error al eliminar archivo: ${error.message}`);
    }
  }
};

module.exports = filesRepository;