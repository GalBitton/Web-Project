import mongoose from 'mongoose';
import config from "config";

// Retrieve server configuration
const serverConfig = config.get('server');
const db_uri = serverConfig.get('db_uri');

/**
 * List of collections to be deleted.
 * @constant
 * @type {string[]}
 */
const collectionsToDelete = [
    'devices',
    'devices-data',
    'logs',
    'users'
];

/**
 * Connects to MongoDB and deletes specified collections.
 * @async
 * @function deleteCollections
 */
const deleteCollections = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(db_uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;

        for (const collectionName of collectionsToDelete) {
            try {
                const collection = db.collection(collectionName);
                await collection.drop();
                console.log(`Deleted collection: ${collectionName}`);
            } catch (error) {
                // check if collection doesn't exist
                if (error.code === 26) {
                    console.warn(`Collection not found: ${collectionName}`);
                } else {
                    throw error;
                }
            }
        }

        console.log('All specified collections deleted successfully');
    } catch (err) {
        console.error('Error during collection deletion:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

deleteCollections();
