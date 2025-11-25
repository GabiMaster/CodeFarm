const Joi = require('joi');
const projectsRepository = require('../../repositories/projects.repository');
const httpStatus = require('../../utils/httpStatusCode');

// Esquema de validación con Joi
const createProjectSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'El ID del usuario es obligatorio'
  }),
  name: Joi.string().min(3).max(50).required().messages({
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede exceder 50 caracteres',
    'any.required': 'El nombre del proyecto es obligatorio'
  }),
  description: Joi.string().max(200).allow('').optional().messages({
    'string.max': 'La descripción no puede exceder 200 caracteres'
  }),
  language: Joi.string().valid('javascript', 'python', 'java', 'cpp', 'csharp').required().messages({
    'any.only': 'El lenguaje debe ser javascript, python, java, cpp o csharp',
    'any.required': 'El lenguaje es obligatorio'
  }),
  template: Joi.string().valid('blank', 'basic', 'advanced').default('blank').messages({
    'any.only': 'La plantilla debe ser blank, basic o advanced'
  })
});

const createProjectService = async (data) => {
  // 1. Validar datos con Joi
  const { error, value } = createProjectSchema.validate(data);
  
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // 2. Crear el proyecto en Realtime Database
  const projectData = {
    userId: value.userId,
    name: value.name,
    description: value.description || '',
    language: value.language,
    template: value.template,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const projectId = await projectsRepository.createProject(projectData);

  return {
    projectId,
    ...projectData
  };
};

module.exports = createProjectService;