const admin = require('firebase-admin');
const httpStatus = require('../utils/httpStatusCode');
const { sendResponse } = require('../utils/response');

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Obtener el token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendResponse(
        res,
        httpStatus.UNAUTHORIZED,
        'Token de autenticación requerido',
        null
      );
    }

    // 2. Extraer el token
    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      return sendResponse(
        res,
        httpStatus.UNAUTHORIZED,
        'Token inválido',
        null
      );
    }

    // 3. Verificar el token con Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(token);

    // 4. Agregar el uid del usuario al request para usarlo en los servicios
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };

    // 5. Continuar con la siguiente función
    next();
  } catch (error) {
    console.error('Error en authMiddleware:', error.message);

    if (error.code === 'auth/id-token-expired') {
      return sendResponse(
        res,
        httpStatus.UNAUTHORIZED,
        'Token expirado. Por favor inicia sesión nuevamente',
        null
      );
    }

    if (error.code === 'auth/argument-error') {
      return sendResponse(
        res,
        httpStatus.UNAUTHORIZED,
        'Token inválido',
        null
      );
    }

    return sendResponse(
      res,
      httpStatus.UNAUTHORIZED,
      'No autorizado',
      null
    );
  }
};

module.exports = authMiddleware;