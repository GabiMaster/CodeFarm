const executionsRepository = require('../../repositories/executions.repository');
const projectsRepository = require('../../repositories/projects.repository');
const filesRepository = require('../../repositories/files.repository');
const usersRepository = require('../../repositories/users.repository');
const httpStatus = require('../../utils/httpStatusCode');

const getExecutionsByProjectService = async (projectId) => {
  if (!projectId) {
    const err = new Error('El ID del proyecto es obligatorio');
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // Verificar que el proyecto existe
  const project = await projectsRepository.getProjectById(projectId);
  
  if (!project) {
    const err = new Error('Proyecto no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  const executionsData = await executionsRepository.getExecutionsByProject(projectId);
  
  if (!executionsData) {
    return {
      projectId,
      executions: []
    };
  }

  const executionsArray = await Promise.all(
    Object.entries(executionsData).map(async ([id, exec]) => {
      const file = await filesRepository.getFileById(exec.fileId);
      const user = await usersRepository.getUserById(exec.userId);
      
      return {
        executionId: id,
        fileId: exec.fileId,
        fileName: file?.name || 'Archivo desconocido',
        userId: exec.userId,
        userName: user?.displayName || 'Usuario desconocido',
        status: exec.status,
        executionTime: exec.executionTime,
        createdAt: exec.createdAt
      };
    })
  );

  return {
    projectId,
    executions: executionsArray
  };
};

module.exports = getExecutionsByProjectService;