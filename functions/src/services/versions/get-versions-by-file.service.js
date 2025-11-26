const versionsRepository = require('../../repositories/versions.repository');
const filesRepository = require('../../repositories/files.repository');
const usersRepository = require('../../repositories/users.repository');
const httpStatus = require('../../utils/httpStatusCode');

const getVersionsByFileService = async (fileId) => {
  if (!fileId) {
    const err = new Error('El ID del archivo es obligatorio');
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // Verificar que el archivo existe
  const file = await filesRepository.getFileById(fileId);
  
  if (!file) {
    const err = new Error('Archivo no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  const versionsData = await versionsRepository.getVersionsByFile(fileId);
  
  if (!versionsData) {
    return {
      fileId,
      fileName: file.name,
      versions: []
    };
  }

  const versionsArray = await Promise.all(
    Object.entries(versionsData).map(async ([id, version]) => {
      const user = await usersRepository.getUserById(version.userId);
      
      return {
        versionId: id,
        versionNumber: version.versionNumber,
        message: version.message,
        userId: version.userId,
        userName: user?.displayName || 'Usuario desconocido',
        createdAt: version.createdAt
      };
    })
  );

  // Ordenar por número de versión descendente
  versionsArray.sort((a, b) => b.versionNumber - a.versionNumber);

  return {
    fileId,
    fileName: file.name,
    versions: versionsArray
  };
};

module.exports = getVersionsByFileService;