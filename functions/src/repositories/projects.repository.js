const { db } = require('../config/firebase');

const projectsRepository = {
  // Crear proyecto
  createProject: async (projectData) => {
    try {
      const newProjectRef = db.ref('projects').push();
      await newProjectRef.set(projectData);
      return newProjectRef.key;
    } catch (error) {
      throw new Error(`Error al crear proyecto: ${error.message}`);
    }
  },

  // Obtener proyectos por usuario
  getProjectsByUser: async (userId) => {
    try {
      const snapshot = await db.ref('projects')
        .orderByChild('userId')
        .equalTo(userId)
        .once('value');
      
      if (!snapshot.exists()) {
        return [];
      }

      const projects = [];
      snapshot.forEach((childSnapshot) => {
        projects.push({
          projectId: childSnapshot.key,
          ...childSnapshot.val()
        });
      });

      return projects;
    } catch (error) {
      throw new Error(`Error al obtener proyectos del usuario: ${error.message}`);
    }
  },

  // Obtener proyecto por ID
  getProjectById: async (projectId) => {
    try {
      const snapshot = await db.ref(`projects/${projectId}`).once('value');
      
      if (!snapshot.exists()) {
        return null;
      }

      return {
        projectId: snapshot.key,
        ...snapshot.val()
      };
    } catch (error) {
      throw new Error(`Error al obtener proyecto: ${error.message}`);
    }
  },

  // Actualizar proyecto
  updateProject: async (projectId, updates) => {
    try {
      await db.ref(`projects/${projectId}`).update({
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      throw new Error(`Error al actualizar proyecto: ${error.message}`);
    }
  },

  // Eliminar proyecto
  deleteProject: async (projectId) => {
    try {
      await db.ref(`projects/${projectId}`).remove();
    } catch (error) {
      throw new Error(`Error al eliminar proyecto: ${error.message}`);
    }
  }
};

module.exports = projectsRepository;