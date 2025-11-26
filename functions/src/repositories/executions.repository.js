const { db } = require('../config/firebase');

const executionsRepository = {
  // Crear una nueva ejecución
  createExecution: async (executionData) => {
    const newExecutionRef = db.ref('executions').push();
    await newExecutionRef.set(executionData);
    return { id: newExecutionRef.key, ...executionData };
  },

  // Obtener una ejecución por su ID
  getExecutionById: async (executionId) => {
    const snapshot = await db.ref(`executions/${executionId}`).once('value');
    return snapshot.val();
  },

  // Obtener todas las ejecuciones de un proyecto
  getExecutionsByProject: async (projectId) => {
    const snapshot = await db.ref('executions')
      .orderByChild('projectId')
      .equalTo(projectId)
      .once('value');
    return snapshot.val();
  }
};

module.exports = executionsRepository;