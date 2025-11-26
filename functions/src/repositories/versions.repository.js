const { db } = require('../config/firebase');

const versionsRepository = {
  // Crear una nueva versión
  createVersion: async (versionData) => {
    const newVersionRef = db.ref('versions').push();
    await newVersionRef.set(versionData);
    return { id: newVersionRef.key, ...versionData };
  },

  // Obtener todas las versiones de un archivo
  getVersionsByFile: async (fileId) => {
    const snapshot = await db.ref('versions')
      .orderByChild('fileId')
      .equalTo(fileId)
      .once('value');
    return snapshot.val();
  },

  // Obtener una versión por su ID
  getVersionById: async (versionId) => {
    const snapshot = await db.ref(`versions/${versionId}`).once('value');
    return snapshot.val();
  }
};

module.exports = versionsRepository;