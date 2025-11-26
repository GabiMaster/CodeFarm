const versionsRepository = require('../../repositories/versions.repository');
const filesRepository = require('../../repositories/files.repository');
const httpStatus = require('../../utils/httpStatusCode');

const restoreVersionService = async (versionId) => {
  if (!versionId) {
    const err = new Error('El ID de la versión es obligatorio');
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // 1. Verificar que la versión existe
  const version = await versionsRepository.getVersionById(versionId);
  
  if (!version) {
    const err = new Error('Versión no encontrada');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  // 2. Verificar que el archivo existe
  const file = await filesRepository.getFileById(version.fileId);
  
  if (!file) {
    const err = new Error('Archivo no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  // 3. Restaurar contenido del archivo
  await filesRepository.updateFile(version.fileId, {
    content: version.content
  });

  return {
    message: 'Versión restaurada correctamente',
    fileId: version.fileId,
    fileName: file.name,
    versionNumber: version.versionNumber,
    restoredAt: new Date().toISOString()
  };
};

module.exports = restoreVersionService;