const Joi = require('joi');
const executionsRepository = require('../../repositories/executions.repository');
const projectsRepository = require('../../repositories/projects.repository');
const filesRepository = require('../../repositories/files.repository');
const httpStatus = require('../../utils/httpStatusCode');

// Esquema de validación con Joi
const executeCodeSchema = Joi.object({
  projectId: Joi.string().required().messages({
    'any.required': 'El ID del proyecto es obligatorio'
  }),
  fileId: Joi.string().required().messages({
    'any.required': 'El ID del archivo es obligatorio'
  }),
  code: Joi.string().required().messages({
    'any.required': 'El código es obligatorio'
  }),
  language: Joi.string().valid('javascript', 'python', 'java').required().messages({
    'any.only': 'El lenguaje debe ser javascript, python o java',
    'any.required': 'El lenguaje es obligatorio'
  }),
  userId: Joi.string().required().messages({
    'any.required': 'El ID del usuario es obligatorio'
  })
});

const executeCodeService = async (data) => {
  // 1. Validar datos con Joi
  const { error, value } = executeCodeSchema.validate(data);
  
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // 2. Verificar que el proyecto existe
  const project = await projectsRepository.getProjectById(value.projectId);
  
  if (!project) {
    const err = new Error('Proyecto no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  // 3. Verificar que el archivo existe
  const file = await filesRepository.getFileById(value.fileId);
  
  if (!file) {
    const err = new Error('Archivo no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  // 4. Simular ejecución de código (por ahora)
  const startTime = Date.now();
  let output = '';
  let executionError = null;
  let status = 'success';

  try {
    // Simulación simple de ejecución
    if (value.language === 'javascript') {
      // Por ahora solo simulamos la salida
      output = 'Código ejecutado correctamente (simulación)';
    } else {
      output = 'Ejecución no implementada para este lenguaje';
    }
  } catch (err) {
    executionError = err.message;
    status = 'error';
  }

  const executionTime = Date.now() - startTime;

  // 5. Guardar resultado de ejecución
  const executionData = {
    projectId: value.projectId,
    fileId: value.fileId,
    userId: value.userId,
    code: value.code,
    language: value.language,
    output,
    error: executionError,
    status,
    executionTime,
    createdAt: new Date().toISOString()
  };

  const result = await executionsRepository.createExecution(executionData);

  return {
    executionId: result.id,
    result: {
      output,
      error: executionError,
      executionTime,
      status,
      timestamp: executionData.createdAt
    }
  };
};

module.exports = executeCodeService;