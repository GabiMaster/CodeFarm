const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

// Importar services
const createVersionService = require('../services/versions/create-versions.service');
const getVersionsByFileService = require('../services/versions/get-versions-by-file.service');
const restoreVersionService = require('../services/versions/restore-version.service');

router.use(authMiddleware);

// POST /versions - Crear versión de archivo
router.post('/', async (req, res) => {
  try {
    const result = await createVersionService(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// GET /versions/file/:fileId - Obtener historial de versiones
router.get('/file/:fileId', async (req, res) => {
  try {
    const result = await getVersionsByFileService(req.params.fileId);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// POST /versions/:versionId/restore - Restaurar versión
router.post('/:versionId/restore', async (req, res) => {
  try {
    const result = await restoreVersionService(req.params.versionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

module.exports = router;