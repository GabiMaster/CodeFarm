const collaboratorsRepository = require('../../repositories/collaborators.repository');
const projectsRepository = require('../../repositories/projects.repository');
const usersRepository = require('../../repositories/users.repository');
const httpStatus = require('../../utils/httpStatusCode');

const getUserCollaborationsService = async (userId) => {
  if (!userId) {
    const err = new Error('El ID del usuario es obligatorio');
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // Verificar que el usuario existe
  const user = await usersRepository.getUserById(userId);
  
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  // Obtener colaboraciones
  const collaborationsData = await collaboratorsRepository.getUserCollaborations(userId);
  
  if (!collaborationsData) {
    return {
      userId,
      projects: []
    };
  }

  const projectsArray = await Promise.all(
    Object.entries(collaborationsData).map(async ([id, collab]) => {
      const project = await projectsRepository.getProjectById(collab.projectId);
      const owner = await usersRepository.getUserById(project?.userId);
      
      return {
        collaboratorId: id,
        projectId: collab.projectId,
        projectName: project?.name || 'Proyecto desconocido',
        role: collab.role,
        owner: project?.userId,
        ownerName: owner?.displayName || 'Usuario desconocido'
      };
    })
  );

  return {
    userId,
    projects: projectsArray
  };
};

module.exports = getUserCollaborationsService;