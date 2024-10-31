import logger from "../utils/logger.js";

const loggerMiddleware = (req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);
    next();
};

export default loggerMiddleware;
