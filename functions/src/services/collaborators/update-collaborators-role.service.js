const Joi = require('joi');
const collaboratorsRepository = require('../../repositories/collaborators.repository');
const httpStatus = require('../../utils/httpStatusCode');

// Esquema de validación con Joi
const updateRoleSchema = Joi.object({
  role: Joi.string().valid('viewer', 'editor', 'admin').required().messages({
    'any.only': 'El rol debe ser viewer, editor o admin',
    'any.required': 'El rol es obligatorio'
  })
});

const updateCollaboratorRoleService = async (collaboratorId, data) => {
  // 1. Validar que el colaborador existe
  const collaborator = await collaboratorsRepository.getCollaboratorById(collaboratorId);
  
  if (!collaborator) {
    const err = new Error('Colaborador no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  // 2. Validar datos con Joi
  const { error, value } = updateRoleSchema.validate(data);
  
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // 3. Actualizar rol
  await collaboratorsRepository.updateCollaboratorRole(collaboratorId, value.role);

  return {
    collaboratorId,
    ...collaborator,
    role: value.role,
    updatedAt: new Date().toISOString()
  };
};

module.exports = updateCollaboratorRoleService;