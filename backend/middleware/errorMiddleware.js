export const errorHandler = (err, req, res, next) => {
    console.error("Global Error Handler:", err);
  
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      message: err.message || "An unknown error occurred",
      // In production, you might want to hide the stack trace:
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  };
  