const projectsRepository = require('../../repositories/projects.repository');
const httpStatus = require('../../utils/httpStatusCode');

const getProjectsByUserService = async (userId) => {
  if (!userId) {
    const err = new Error('El ID del usuario es obligatorio');
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  const projects = await projectsRepository.getProjectsByUser(userId);
  
  return projects;
};

module.exports = getProjectsByUserService;