const Joi = require('joi');
const projectsRepository = require('../../repositories/projects.repository');
const httpStatus = require('../../utils/httpStatusCode');

// Esquema de validación con Joi
const updateProjectSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional().messages({
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede exceder 50 caracteres'
  }),
  description: Joi.string().max(200).allow('').optional().messages({
    'string.max': 'La descripción no puede exceder 200 caracteres'
  }),
  language: Joi.string().valid('javascript', 'python', 'java', 'cpp', 'csharp').optional().messages({
    'any.only': 'El lenguaje debe ser javascript, python, java, cpp o csharp'
  })
});

const updateProjectService = async (projectId, data) => {
  // 1. Validar que el proyecto existe
  const project = await projectsRepository.getProjectById(projectId);
  
  if (!project) {
    const err = new Error('Proyecto no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  // 2. Validar datos con Joi
  const { error, value } = updateProjectSchema.validate(data);
  
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // 3. Actualizar proyecto
  await projectsRepository.updateProject(projectId, value);

  return {
    projectId,
    ...project,
    ...value,
    updatedAt: new Date().toISOString()
  };
};

module.exports = updateProjectService;