const notificationsRepository = require('../../repositories/notifications.repository');
const usersRepository = require('../../repositories/users.repository');
const httpStatus = require('../../utils/httpStatusCode');

const getNotificationsService = async (userId) => {
  if (!userId) {
    const err = new Error('El ID del usuario es obligatorio');
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // Verificar que el usuario existe
  const user = await usersRepository.getUserById(userId);
  
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  // Obtener notificaciones
  const notifications = await notificationsRepository.getNotificationsByUser(userId);
  
  return notifications;
};

module.exports = getNotificationsService;