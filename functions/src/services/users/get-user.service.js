const usersRepository = require('../../repositories/users.repository');
const httpStatus = require('../../utils/httpStatusCode');

const getUserService = async (userId) => {
  if (!userId) {
    const err = new Error('El ID del usuario es obligatorio');
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // Obtener datos del usuario desde Realtime Database
  const userData = await usersRepository.getUserById(userId);
  
  if (!userData) {
    const err = new Error('Usuario no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  return userData;
};

module.exports = getUserService;