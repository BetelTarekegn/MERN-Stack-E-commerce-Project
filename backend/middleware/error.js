const error = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    // Wrong Mongoose Object ID Error
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Resource not found. Invalid: ${err.path}`;
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        const message = Object.values(err.errors).map(value => value.message);
    }

    res.status(statusCode).json({
        success: false,
        error: message,
    });
};
export default error;
