const projectsRepository = require('../../repositories/projects.repository');
const httpStatus = require('../../utils/httpStatusCode');

const deleteProjectService = async (projectId) => {
  if (!projectId) {
    const err = new Error('El ID del proyecto es obligatorio');
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // 1. Verificar que el proyecto existe
  const project = await projectsRepository.getProjectById(projectId);
  
  if (!project) {
    const err = new Error('Proyecto no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  // 2. Eliminar proyecto
  await projectsRepository.deleteProject(projectId);

  return {
    message: 'Proyecto eliminado correctamente',
    projectId
  };
};

module.exports = deleteProjectService;