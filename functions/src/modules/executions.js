const express = require('express');
const router = express.Router();

// Importar services
const executeCodeService = require('../services/executions/execute-code.service');
const getExecutionService = require('../services/executions/get-executions.service');
const getExecutionsByProjectService = require('../services/executions/get-executions-by-project.service');

// POST /executions - Ejecutar código
router.post('/', async (req, res) => {
  try {
    const result = await executeCodeService(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// GET /executions/:executionId - Obtener resultado de ejecución
router.get('/:executionId', async (req, res) => {
  try {
    const result = await getExecutionService(req.params.executionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// GET /executions/project/:projectId - Obtener historial de ejecuciones
router.get('/project/:projectId', async (req, res) => {
  try {
    const result = await getExecutionsByProjectService(req.params.projectId);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
});

module.exports = router;