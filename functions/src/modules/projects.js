const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const createProjectService = require('../services/projects/create-project.service');
const getProjectsByUserService = require('../services/projects/get-projects-by-user.service');
const getProjectByIdService = require('../services/projects/get-project-by-id.service');
const updateProjectService = require('../services/projects/update-project.service');
const deleteProjectService = require('../services/projects/delete-project.service');
const { sendSuccess, sendError } = require('../utils/response');
const httpStatus = require('../utils/httpStatusCode');

router.use(authMiddleware);

// POST /projects
router.post('/', async (req, res) => {
  try {
    const { name, description, language } = req.body;
    const result = await createProjectService({
      name,
      description,
      language,
      userId: req.user.uid
    });
    return sendSuccess(res, httpStatus.CREATED, 'Proyecto creado exitosamente', result);
  } catch (error) {
    return sendError(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
});

// GET /projects/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const result = await getProjectsByUserService(req.params.userId);
    return sendSuccess(res, httpStatus.OK, 'Proyectos obtenidos exitosamente', result);
  } catch (error) {
    return sendError(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
});

// GET /projects/:projectId
router.get('/:projectId', async (req, res) => {
  try {
    const result = await getProjectByIdService(req.params.projectId, req.user.uid);
    return sendSuccess(res, httpStatus.OK, 'Proyecto obtenido exitosamente', result);
  } catch (error) {
    return sendError(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
});

// PUT /projects/:projectId
router.put('/:projectId', async (req, res) => {
  try {
    const result = await updateProjectService(req.params.projectId, req.user.uid, req.body);
    return sendSuccess(res, httpStatus.OK, 'Proyecto actualizado exitosamente', result);
  } catch (error) {
    return sendError(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
});

// DELETE /projects/:projectId
router.delete('/:projectId', async (req, res) => {
  try {
    const result = await deleteProjectService(req.params.projectId, req.user.uid);
    return sendSuccess(res, httpStatus.OK, 'Proyecto eliminado exitosamente', result);
  } catch (error) {
    return sendError(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
});

module.exports = router;