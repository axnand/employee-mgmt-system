// utils/logger.js
import winston from "winston";

// Define your custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta) : ""
    }`;
  })
);

// Create the logger instance
const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    // Log to console
    new winston.transports.Console(),
    // Log to a file named "app.log" under the logs folder
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

export default logger;
