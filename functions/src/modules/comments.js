const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

// Importar services
const createCommentService = require('../services/comments/create-comment.service');
const getCommentsByFileService = require('../services/comments/get-comments-by-file.service');
const updateCommentService = require('../services/comments/update-comment.service');
const deleteCommentService = require('../services/comments/delete-comment.service');

router.use(authMiddleware);

// POST /comments - Crear comentario
router.post('/', async (req, res) => {
  try {
    const result = await createCommentService(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// GET /comments/file/:fileId - Obtener comentarios de un archivo
router.get('/file/:fileId', async (req, res) => {
  try {
    const result = await getCommentsByFileService(req.params.fileId);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// PUT /comments/:commentId - Actualizar comentario
router.put('/:commentId', async (req, res) => {
  try {
    const result = await updateCommentService(req.params.commentId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// DELETE /comments/:commentId - Eliminar comentario
router.delete('/:commentId', async (req, res) => {
  try {
    const result = await deleteCommentService(req.params.commentId);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

module.exports = router;