const Joi = require('joi');
const filesRepository = require('../../repositories/files.repository');
const httpStatus = require('../../utils/httpStatusCode');

// Esquema de validación con Joi
const updateFileSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional().messages({
    'string.min': 'El nombre del archivo debe tener al menos 1 caracter',
    'string.max': 'El nombre del archivo no puede exceder 100 caracteres'
  }),
  content: Joi.string().allow('').optional().messages({
    'string.base': 'El contenido debe ser texto'
  }),
  path: Joi.string().optional().messages({
    'string.base': 'La ruta debe ser texto'
  }),
  extension: Joi.string().allow('').optional().messages({
    'string.base': 'La extensión debe ser texto'
  })
});

const updateFileService = async (fileId, data) => {
  // 1. Validar que el archivo existe
  const file = await filesRepository.getFileById(fileId);
  
  if (!file) {
    const err = new Error('Archivo no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  // 2. Validar datos con Joi
  const { error, value } = updateFileSchema.validate(data);
  
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // 3. Actualizar archivo
  await filesRepository.updateFile(fileId, value);

  return {
    fileId,
    ...file,
    ...value,
    updatedAt: new Date().toISOString()
  };
};

module.exports = updateFileService;