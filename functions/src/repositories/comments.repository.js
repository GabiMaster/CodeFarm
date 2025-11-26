const { db } = require('../config/firebase');

const commentsRepository = {
  // Crear un nuevo comentario
  createComment: async (commentData) => {
    const newCommentRef = db.ref('comments').push();
    await newCommentRef.set(commentData);
    return { id: newCommentRef.key, ...commentData };
  },

  // Obtener todos los comentarios de un archivo
  getCommentsByFile: async (fileId) => {
    const snapshot = await db.ref('comments')
      .orderByChild('fileId')
      .equalTo(fileId)
      .once('value');
    return snapshot.val();
  },

  // Obtener un comentario por su ID
  getCommentById: async (commentId) => {
    const snapshot = await db.ref(`comments/${commentId}`).once('value');
    return snapshot.val();
  },

  // Actualizar un comentario
  updateComment: async (commentId, content) => {
    await db.ref(`comments/${commentId}`).update({
      content,
      updatedAt: new Date().toISOString()
    });
  },

  // Eliminar un comentario
  deleteComment: async (commentId) => {
    await db.ref(`comments/${commentId}`).remove();
  }
};

module.exports = commentsRepository;