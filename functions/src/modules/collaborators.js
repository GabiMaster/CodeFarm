const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const addCollaboratorService = require('../services/collaborators/add-collaborator.service');
const getCollaboratorsByProjectService = require('../services/collaborators/get-collaborators-by-project.service');
const updateCollaboratorRoleService = require('../services/collaborators/update-collaborators-role.service');
const deleteCollaboratorService = require('../services/collaborators/delete-collaborator.service');
const getUserCollaborationsService = require('../services/collaborators/get-user-collaborations.service');

router.use(authMiddleware);

// POST /collaborators - Agregar colaborador
router.post('/', async (req, res) => {
  try {
    const result = await addCollaboratorService(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// GET /collaborators/project/:projectId - Listar colaboradores
router.get('/project/:projectId', async (req, res) => {
  try {
    const result = await getCollaboratorsByProjectService(req.params.projectId);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// PUT /collaborators/:collaboratorId - Actualizar rol
router.put('/:collaboratorId', async (req, res) => {
  try {
    const result = await updateCollaboratorRoleService(req.params.collaboratorId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// DELETE /collaborators/:collaboratorId - Eliminar colaborador
router.delete('/:collaboratorId', async (req, res) => {
  try {
    const result = await deleteCollaboratorService(req.params.collaboratorId);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// GET /collaborators/user/:userId - Proyectos como colaborador
router.get('/user/:userId', async (req, res) => {
  try {
    const result = await getUserCollaborationsService(req.params.userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

module.exports = router;