const Joi = require('joi');
const authRepository = require('../../repositories/auth.repository');
const httpStatus = require('../../utils/httpStatusCode');

// Esquema de validación con Joi
const changePasswordSchema = Joi.object({
  uid: Joi.string().required().messages({
    'any.required': 'El UID del usuario es obligatorio'
  }),
  currentPassword: Joi.string().required().messages({
    'any.required': 'La contraseña actual es obligatoria'
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'La nueva contraseña debe tener al menos 6 caracteres',
    'any.required': 'La nueva contraseña es obligatoria'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Las contraseñas no coinciden',
    'any.required': 'Debes confirmar la nueva contraseña'
  })
});

const changePasswordService = async (data) => {
  // 1. Validar datos con Joi
  const { error, value } = changePasswordSchema.validate(data);
  
  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = httpStatus.BAD_REQUEST;
    throw err;
  }

  // 2. Verificar que el usuario existe
  const userData = await authRepository.getUserData(value.uid);
  
  if (!userData) {
    const err = new Error('Usuario no encontrado');
    err.statusCode = httpStatus.NOT_FOUND;
    throw err;
  }

  // 3. Actualizar la contraseña en Firebase Auth
  await authRepository.updatePassword(value.uid, value.newPassword);

  // 4. Actualizar timestamp en Realtime Database
  await authRepository.updateUserData(value.uid, {
    updatedAt: new Date().toISOString()
  });

  return {
    message: 'Contraseña actualizada correctamente'
  };
};

module.exports = changePasswordService;