const Joi = require('joi');
const commentsRepository = require('../../repositories/comments.repository');
const filesRepository = require('../../repositories/files.repository');
const usersRepository = require('../../repositories/users.repository');
const httpStatus = require('../../utils/httpStatusCode');

// Esquema de validación con Joi
const createCommentSchema = Joi.object({
  fileId: Joi.string().required().messages({
    'any.required': 'El ID del archivo es obligatorio'
  }),
  userId: Joi.string().required().messages({
    'any.required': 'El ID del usuario es obligatorio'
  }),
  content: Joi.string().min(1).required().messages({
    'string.min': 'El contenido debe tener al menos 1 carácter',
    'any.required': 'El contenido es obligatorio'
  }),
  lineNumber: Joi.number().optional()
});

const createCommentService = async (data) => {
  // 1. Validar datos con Joi
  const { error, value } = createCommentSchema.validate(data);
  
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

  // 4. Crear comentario
  const commentData = {
    fileId: value.fileId,
    userId: value.userId,
    content: value.content,
    lineNumber: value.lineNumber || null,
    createdAt: new Date().toISOString(),
    updatedAt: null
  };

  const result = await commentsRepository.createComment(commentData);

  return {
    commentId: result.id,
    data: {
      ...commentData,
      userName: user.displayName
    }
  };
};

module.exports = createCommentService;