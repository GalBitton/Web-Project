import mongoose from 'mongoose';

const connect = (url, logger) => {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        logger.info('MongoDB connected');

        const dbName = 'neurosync';
        const db = mongoose.connection.useDb(dbName);
        logger.info(`Switched to database: ${dbName}`);
    })
    .catch((err) => logger.error(`Error connecting to MongoDB: ${err}`));
}

export default connect;
