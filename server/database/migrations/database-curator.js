import mongoose from 'mongoose';
import config from "config";

const serverConfig = config.get('server');
const db_uri = serverConfig.get('db_uri');

const collectionsToDelete = [
    'devices',
    'devices-data',
    'logs',
    'users'
];

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
            const collection = db.collection(collectionName);
            await collection.drop();
            console.log(`Deleted collection: ${collectionName}`);
        }

        console.log('All specified collections deleted successfully');
    } catch (err) {
        console.error('Error during collection deletion:', err);
    } finally {
        mongoose.disconnect();
    }
};

deleteCollections();
