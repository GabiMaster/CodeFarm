const sendResponse = (res, statusCode, message, payload = null) => {
  return res.status(statusCode).json({
    status: statusCode,
    message,
    payload
  });
};

const sendSuccess = (res, statusCode, message, data = null) => {
  return sendResponse(res, statusCode, message, data);
};

const sendError = (res, statusCode, message, error = null) => {
  return sendResponse(res, statusCode, message, error);
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendError
};