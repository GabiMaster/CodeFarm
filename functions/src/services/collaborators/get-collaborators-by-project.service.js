const collaboratorsRepository = require('../../repositories/collaborators.repository');
const projectsRepository = require('../../repositories/projects.repository');
const usersRepository = require('../../repositories/users.repository');
const httpStatus = require('../../utils/httpStatusCode');

const getCollaboratorsByProjectService = async (projectId) => {
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

  const collaboratorsData = await collaboratorsRepository.getCollaboratorsByProject(projectId);
  
  if (!collaboratorsData) {
    return {
      projectId,
      collaborators: []
    };
  }

  const collaboratorsArray = await Promise.all(
    Object.entries(collaboratorsData).map(async ([id, collab]) => {
      const user = await usersRepository.getUserById(collab.userId);
      return {
        id,
        userId: collab.userId,
        userName: user?.displayName || 'Usuario desconocido',
        userEmail: user?.email || '',
        role: collab.role,
        invitedBy: collab.invitedBy,
        createdAt: collab.createdAt
      };
    })
  );

  return {
    projectId,
    collaborators: collaboratorsArray
  };
};

module.exports = getCollaboratorsByProjectService;