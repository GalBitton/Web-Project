import mongoose from 'mongoose';

/**
 * Connects to a MongoDB database and switches to a specified database.
 *
 * @param {string} url - The connection URL for MongoDB.
 * @param {Object} logger - The logger object used to log connection status and errors.
 * @param {Function} logger.info - Method to log informational messages.
 * @param {Function} logger.error - Method to log error messages.
 */
const connect = (url, logger) => {
    mongoose.connect(url)
    .then(() => {
        logger.info('MongoDB connected');
    })
    .catch((err) => logger.error(`Error connecting to MongoDB: ${err}`));
}

export default connect;
