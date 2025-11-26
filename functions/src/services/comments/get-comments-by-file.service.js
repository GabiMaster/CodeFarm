const commentsRepository = require('../../repositories/comments.repository');
const filesRepository = require('../../repositories/files.repository');
const usersRepository = require('../../repositories/users.repository');
const httpStatus = require('../../utils/httpStatusCode');

const getCommentsByFileService = async (fileId) => {
  if (!fileId) {
    const err = new Error('El ID del archivo es obligatorio');
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // Verificar que el archivo existe
  const file = await filesRepository.getFileById(fileId);
  
  if (!file) {
    const err = new Error('Archivo no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  const commentsData = await commentsRepository.getCommentsByFile(fileId);
  
  if (!commentsData) {
    return {
      fileId,
      comments: []
    };
  }

  const commentsArray = await Promise.all(
    Object.entries(commentsData).map(async ([id, comment]) => {
      const user = await usersRepository.getUserById(comment.userId);
      
      return {
        commentId: id,
        userId: comment.userId,
        userName: user?.displayName || 'Usuario desconocido',
        userAvatar: user?.photoURL || null,
        content: comment.content,
        lineNumber: comment.lineNumber,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt
      };
    })
  );

  return {
    fileId,
    comments: commentsArray
  };
};

module.exports = getCommentsByFileService;