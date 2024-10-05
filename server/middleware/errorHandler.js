// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err); // Log the error stack for debugging

    const statusCode = err.statusCode || 500; // Default to 500 if no status code is provided
    const message = err.message || 'An unexpected error occurred'; // Default message

    return res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};

export default errorHandler;
