const executionsRepository = require('../../repositories/executions.repository');
const httpStatus = require('../../utils/httpStatusCode');

const getExecutionService = async (executionId) => {
  if (!executionId) {
    const err = new Error('El ID de la ejecución es obligatorio');
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // Obtener ejecución
  const execution = await executionsRepository.getExecutionById(executionId);
  
  if (!execution) {
    const err = new Error('Ejecución no encontrada');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  return {
    executionId,
    ...execution
  };
};

module.exports = getExecutionService;