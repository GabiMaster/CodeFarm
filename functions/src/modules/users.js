const express = require('express');
const router = express.Router();
const getUserService = require('../services/users/get-user.service');
const updateUserService = require('../services/users/update-user.service');
const { sendSuccess, sendError } = require('../utils/response');
const httpStatus = require('../utils/httpStatusCode');

// GET /users/:userId
router.get('/:userId', async (req, res) => {
  try {
    const result = await getUserService(req.params.userId);
    return sendSuccess(res, httpStatus.OK, 'Usuario obtenido exitosamente', result);
  } catch (error) {
    return sendError(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
});

// PUT /users/:userId
router.put('/:userId', async (req, res) => {
  try {
    const result = await updateUserService(req.params.userId, req.body);
    return sendSuccess(res, httpStatus.OK, 'Usuario actualizado exitosamente', result);
  } catch (error) {
    return sendError(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
});

module.exports = router;