const filesRepository = require('../../repositories/files.repository');
const httpStatus = require('../../utils/httpStatusCode');

const deleteFileService = async (fileId) => {
  if (!fileId) {
    const err = new Error('El ID del archivo es obligatorio');
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // 1. Verificar que el archivo existe
  const file = await filesRepository.getFileById(fileId);
  
  if (!file) {
    const err = new Error('Archivo no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  // 2. Eliminar archivo
  await filesRepository.deleteFile(fileId);

  return {
    message: 'Archivo eliminado correctamente',
    fileId
  };
};

module.exports = deleteFileService;