const Joi = require('joi');
const versionsRepository = require('../../repositories/versions.repository');
const filesRepository = require('../../repositories/files.repository');
const usersRepository = require('../../repositories/users.repository');
const httpStatus = require('../../utils/httpStatusCode');

// Esquema de validación con Joi
const createVersionSchema = Joi.object({
  fileId: Joi.string().required().messages({
    'any.required': 'El ID del archivo es obligatorio'
  }),
  userId: Joi.string().required().messages({
    'any.required': 'El ID del usuario es obligatorio'
  }),
  content: Joi.string().required().messages({
    'any.required': 'El contenido es obligatorio'
  }),
  message: Joi.string().optional()
});

const createVersionService = async (data) => {
  // 1. Validar datos con Joi
  const { error, value } = createVersionSchema.validate(data);
  
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // 2. Verificar que el archivo existe
  const file = await filesRepository.getFileById(value.fileId);
  
  if (!file) {
    const err = new Error('Archivo no encontrado');
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

  // 4. Obtener número de versión
  const versions = await versionsRepository.getVersionsByFile(value.fileId);
  const versionNumber = versions ? Object.keys(versions).length + 1 : 1;

  // 5. Crear versión
  const versionData = {
    fileId: value.fileId,
    userId: value.userId,
    content: value.content,
    message: value.message || `Versión ${versionNumber}`,
    versionNumber,
    createdAt: new Date().toISOString()
  };

  const result = await versionsRepository.createVersion(versionData);

  return {
    versionId: result.id,
    versionNumber,
    message: versionData.message,
    createdAt: versionData.createdAt
  };
};

module.exports = createVersionService;