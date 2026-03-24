const { ZodError } = require("zod");
const { HttpError } = require("../errors/httpError");

function errorHandler(error, _req, res, _next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "validation_error",
      details: error.issues,
    });
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      error: error.code,
      details: error.details ?? undefined,
    });
  }

  console.error("Unhandled API error:", error);

  return res.status(500).json({
    error: "internal_error",
  });
}

module.exports = { errorHandler };
