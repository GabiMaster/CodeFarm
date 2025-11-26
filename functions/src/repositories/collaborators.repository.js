const { db } = require('../config/firebase');

const collaboratorsRepository = {
  // Agregar un colaborador a un proyecto
  addCollaborator: async (collaboratorData) => {
    const newCollaboratorRef = db.ref('collaborators').push();
    await newCollaboratorRef.set(collaboratorData);
    return { id: newCollaboratorRef.key, ...collaboratorData };
  },

  // Verificar si un usuario ya es colaborador de un proyecto
  checkExistingCollaborator: async (projectId, userId) => {
    const snapshot = await db.ref('collaborators')
      .orderByChild('projectId')
      .equalTo(projectId)
      .once('value');
    
    const collaborators = snapshot.val();
    if (!collaborators) return null;

    return Object.entries(collaborators).find(([_, collab]) => collab.userId === userId);
  },

  // Obtener todos los colaboradores de un proyecto
  getCollaboratorsByProject: async (projectId) => {
    const snapshot = await db.ref('collaborators')
      .orderByChild('projectId')
      .equalTo(projectId)
      .once('value');
    return snapshot.val();
  },

  // Obtener un colaborador por su ID
  getCollaboratorById: async (collaboratorId) => {
    const snapshot = await db.ref(`collaborators/${collaboratorId}`).once('value');
    return snapshot.val();
  },

  // Actualizar el rol de un colaborador
  updateCollaboratorRole: async (collaboratorId, role) => {
    await db.ref(`collaborators/${collaboratorId}`).update({
      role,
      updatedAt: new Date().toISOString()
    });
  },

  // Eliminar un colaborador
  deleteCollaborator: async (collaboratorId) => {
    await db.ref(`collaborators/${collaboratorId}`).remove();
  },

  // Obtener todos los proyectos donde un usuario es colaborador
  getUserCollaborations: async (userId) => {
    const snapshot = await db.ref('collaborators')
      .orderByChild('userId')
      .equalTo(userId)
      .once('value');
    return snapshot.val();
  }
};

module.exports = collaboratorsRepository;