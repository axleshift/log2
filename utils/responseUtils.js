export const sendResponse = (res, statusCode, message, data = {}) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const sendErrorResponse = (res, statusCode, message, errorDetails = null) => {
    res.status(statusCode).json({
        success: false,
        message,
        error: errorDetails,
    });
};
