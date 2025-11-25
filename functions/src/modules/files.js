const express = require('express');
const router = express.Router();
const createFileService = require('../services/files/create-file.service');
const getFilesByProjectService = require('../services/files/get-files-by-project.service');
const updateFileService = require('../services/files/update-file.service');
const deleteFileService = require('../services/files/delete-file.service');
const { sendSuccess, sendError } = require('../utils/response');
const httpStatus = require('../utils/httpStatusCode');

// POST /files
router.post('/', async (req, res) => {
  try {
    const result = await createFileService(req.body);
    return sendSuccess(res, httpStatus.CREATED, 'Archivo creado exitosamente', result);
  } catch (error) {
    return sendError(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
});

// GET /files/project/:projectId
router.get('/project/:projectId', async (req, res) => {
  try {
    const result = await getFilesByProjectService(req.params.projectId);
    return sendSuccess(res, httpStatus.OK, 'Archivos obtenidos exitosamente', result);
  } catch (error) {
    return sendError(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
});

// PUT /files/:fileId
router.put('/:fileId', async (req, res) => {
  try {
    const result = await updateFileService(req.params.fileId, req.body);
    return sendSuccess(res, httpStatus.OK, 'Archivo actualizado exitosamente', result);
  } catch (error) {
    return sendError(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
});

// DELETE /files/:fileId
router.delete('/:fileId', async (req, res) => {
  try {
    const result = await deleteFileService(req.params.fileId);
    return sendSuccess(res, httpStatus.OK, 'Archivo eliminado exitosamente', result);
  } catch (error) {
    return sendError(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
});

module.exports = router;