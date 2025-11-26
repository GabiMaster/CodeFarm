const Joi = require('joi');
const commentsRepository = require('../../repositories/comments.repository');
const httpStatus = require('../../utils/httpStatusCode');

// Esquema de validación con Joi
const updateCommentSchema = Joi.object({
  content: Joi.string().min(1).required().messages({
    'string.min': 'El contenido debe tener al menos 1 carácter',
    'any.required': 'El contenido es obligatorio'
  })
});

const updateCommentService = async (commentId, data) => {
  // 1. Verificar que el comentario existe
  const comment = await commentsRepository.getCommentById(commentId);
  
  if (!comment) {
    const err = new Error('Comentario no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  // 2. Validar datos con Joi
  const { error, value } = updateCommentSchema.validate(data);
  
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // 3. Actualizar comentario
  await commentsRepository.updateComment(commentId, value.content);

  return {
    commentId,
    content: value.content,
    updatedAt: new Date().toISOString()
  };
};

module.exports = updateCommentService;