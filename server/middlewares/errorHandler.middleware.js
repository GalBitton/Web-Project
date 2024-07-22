const errorHandler = (err, req, res, next) => {
    const errorResponse = {
        message: err.message || 'Internal server error'
    };

    if (process.env.NODE_ENV !== 'production') {
        errorResponse.detailed = {
            stack: err.stack,
        };
    }

    if (res.headersSent) {
        return next(err);
    }

    return res.status(500).send(errorResponse);
};

export default errorHandler;