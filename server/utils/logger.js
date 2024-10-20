import winston from "winston";

const isProduction = process.env.NODE_ENV === "production";

const logger = winston.createLogger({
    level: isProduction ? "error" : "info",
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.Console({
            format: isProduction ? winston.format.json() : winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
    ],
});

export default logger;
