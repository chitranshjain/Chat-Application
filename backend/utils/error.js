class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.code = statusCode;
  }
}

const errorHandler = (error, response) => {
  console.log(`An error occurred, ERROR : ${error.message}`);
  response
    .status(error.code)
    .json({ message: "An error occurred", error: error.message });
};

module.exports = { HttpError, errorHandler };
