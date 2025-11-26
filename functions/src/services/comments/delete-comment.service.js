const commentsRepository = require('../../repositories/comments.repository');
const httpStatus = require('../../utils/httpStatusCode');

const deleteCommentService = async (commentId) => {
  if (!commentId) {
    const err = new Error('El ID del comentario es obligatorio');
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // 1. Verificar que el comentario existe
  const comment = await commentsRepository.getCommentById(commentId);
  
  if (!comment) {
    const err = new Error('Comentario no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  // 2. Eliminar comentario
  await commentsRepository.deleteComment(commentId);

  return {
    message: 'Comentario eliminado correctamente',
    commentId
  };
};

module.exports = deleteCommentService;