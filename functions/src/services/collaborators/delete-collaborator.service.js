const collaboratorsRepository = require('../../repositories/collaborators.repository');
const httpStatus = require('../../utils/httpStatusCode');

const deleteCollaboratorService = async (collaboratorId) => {
  if (!collaboratorId) {
    const err = new Error('El ID del colaborador es obligatorio');
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // 1. Verificar que el colaborador existe
  const collaborator = await collaboratorsRepository.getCollaboratorById(collaboratorId);
  
  if (!collaborator) {
    const err = new Error('Colaborador no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  // 2. Eliminar colaborador
  await collaboratorsRepository.deleteCollaborator(collaboratorId);

  return {
    message: 'Colaborador eliminado correctamente',
    collaboratorId
  };
};

module.exports = deleteCollaboratorService;