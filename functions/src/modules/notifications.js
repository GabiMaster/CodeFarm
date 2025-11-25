const express = require('express');
const router = express.Router();
const getNotificationsService = require('../services/notifications/get-notifications.service');
const { sendSuccess, sendError } = require('../utils/response');
const httpStatus = require('../utils/httpStatusCode');

// GET /notifications/:userId
router.get('/:userId', async (req, res) => {
  try {
    const result = await getNotificationsService(req.params.userId);
    return sendSuccess(res, httpStatus.OK, 'Notificaciones obtenidas exitosamente', result);
  } catch (error) {
    return sendError(res, error.statusCode || httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
});

module.exports = router;