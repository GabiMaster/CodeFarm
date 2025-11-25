const Joi = require('joi');
const filesRepository = require('../../repositories/files.repository');
const projectsRepository = require('../../repositories/projects.repository');
const httpStatus = require('../../utils/httpStatusCode');

// Esquema de validación con Joi
const createFileSchema = Joi.object({
  projectId: Joi.string().required().messages({
    'any.required': 'El ID del proyecto es obligatorio'
  }),
  name: Joi.string().min(1).max(100).required().messages({
    'string.min': 'El nombre del archivo debe tener al menos 1 caracter',
    'string.max': 'El nombre del archivo no puede exceder 100 caracteres',
    'any.required': 'El nombre del archivo es obligatorio'
  }),
  content: Joi.string().allow('').default('').messages({
    'string.base': 'El contenido debe ser texto'
  }),
  path: Joi.string().required().messages({
    'any.required': 'La ruta del archivo es obligatoria'
  }),
  type: Joi.string().valid('file', 'folder').default('file').messages({
    'any.only': 'El tipo debe ser file o folder'
  }),
  extension: Joi.string().allow('').optional().messages({
    'string.base': 'La extensión debe ser texto'
  })
});

const createFileService = async (data) => {
  // 1. Validar datos con Joi
  const { error, value } = createFileSchema.validate(data);
  
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

  // 3. Crear el archivo en Realtime Database
  const fileData = {
    projectId: value.projectId,
    name: value.name,
    content: value.content,
    path: value.path,
    type: value.type,
    extension: value.extension || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const fileId = await filesRepository.createFile(fileData);

  return {
    fileId,
    ...fileData
  };
};

module.exports = createFileService;