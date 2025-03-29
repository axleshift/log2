import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
    logger.error(err.message, {
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
        url: req.originalUrl,
        method: req.method,
        params: req.params,
        body: req.body,
    });

    // Determine the status code
    const statusCode = err.status || 500;

    // Send JSON response
    res.status(statusCode).json({
        status: "error",
        message: err,
    });
};

export default errorHandler;
