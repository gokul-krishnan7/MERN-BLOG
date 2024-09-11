export const errorHandler = (statusCode, message) => {
  const error = new Error(message); // Pass message directly to Error constructor
  error.statusCode = statusCode;
  return error;
};
