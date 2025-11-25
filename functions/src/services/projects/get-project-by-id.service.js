const projectsRepository = require('../../repositories/projects.repository');
const httpStatus = require('../../utils/httpStatusCode');

const getProjectByIdService = async (projectId) => {
  if (!projectId) {
    const err = new Error('El ID del proyecto es obligatorio');
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  const project = await projectsRepository.getProjectById(projectId);
  
  if (!project) {
    const err = new Error('Proyecto no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  return project;
};

module.exports = getProjectByIdService;