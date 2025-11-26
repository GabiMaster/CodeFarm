const Joi = require('joi');
const collaboratorsRepository = require('../../repositories/collaborators.repository');
const projectsRepository = require('../../repositories/projects.repository');
const usersRepository = require('../../repositories/users.repository');
const httpStatus = require('../../utils/httpStatusCode');

// Esquema de validación con Joi
const addCollaboratorSchema = Joi.object({
  projectId: Joi.string().required().messages({
    'any.required': 'El ID del proyecto es obligatorio'
  }),
  userId: Joi.string().required().messages({
    'any.required': 'El ID del usuario es obligatorio'
  }),
  role: Joi.string().valid('viewer', 'editor', 'admin').required().messages({
    'any.only': 'El rol debe ser viewer, editor o admin',
    'any.required': 'El rol es obligatorio'
  }),
  invitedBy: Joi.string().required().messages({
    'any.required': 'El ID de quien invita es obligatorio'
  })
});

const addCollaboratorService = async (data) => {
  // 1. Validar datos con Joi
  const { error, value } = addCollaboratorSchema.validate(data);
  
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // 2. Verificar que el proyecto existe
  const project = await projectsRepository.getProjectById(value.projectId);
  
  if (!project) {
    const err = new Error('Proyecto no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  // 3. Verificar que el usuario existe
  const user = await usersRepository.getUserById(value.userId);
  
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  // 4. Verificar que no es el propietario
  if (project.userId === value.userId) {
    const err = new Error('El propietario del proyecto no puede ser agregado como colaborador');
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // 5. Verificar que no está ya agregado
  const existing = await collaboratorsRepository.checkExistingCollaborator(value.projectId, value.userId);
  
  if (existing) {
    const err = new Error('El usuario ya es colaborador de este proyecto');
    err.statusCode = httpStatus.CONFLICT;
    throw err;
  }

  // 6. Crear colaborador
  const collaboratorData = {
    projectId: value.projectId,
    userId: value.userId,
    role: value.role,
    invitedBy: value.invitedBy,
    createdAt: new Date().toISOString()
  };

  const result = await collaboratorsRepository.addCollaborator(collaboratorData);

  return {
    collaboratorId: result.id,
    ...collaboratorData
  };
};

module.exports = addCollaboratorService;