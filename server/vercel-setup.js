import * as path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const newConfigPath = path.join(__dirname, 'config');

if (process.env.NODE_ENV === 'production') {
    process.env.NODE_CONFIG_DIR = newConfigPath;
} else {
    console.log('Not in production, NODE_CONFIG_DIR not set');
}
