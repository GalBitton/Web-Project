import * as path from 'path';
import { fileURLToPath } from 'url';
if (process.env.NODE_ENV === 'production') {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    process.env.NODE_CONFIG_DIR = path.join(__dirname, 'config');
}
