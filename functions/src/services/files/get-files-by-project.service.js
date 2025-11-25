const filesRepository = require('../../repositories/files.repository');
const projectsRepository = require('../../repositories/projects.repository');
const httpStatus = require('../../utils/httpStatusCode');

const getFilesByProjectService = async (projectId) => {
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

  const files = await filesRepository.getFilesByProject(projectId);
  
  return files;
};

module.exports = getFilesByProjectService;