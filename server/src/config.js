import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Load .env from server/ root (one level up from src/)
dotenv.config({ path: resolve(__dirname, '../.env') });

export default {
    WS_PORT: process.env.WS_PORT || 3000,
    HTTP_PORT: process.env.HTTP_PORT || 8080,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/io-game',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret-key',
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173'
};

if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'change-this-secret-key') {
        throw new Error('CRITICAL: Must set strong JWT_SECRET in production!');
    }
    if (!process.env.MONGODB_URI?.includes('mongodb+srv://')) {
        throw new Error('CRITICAL: Must use MongoDB Atlas in production!');
    }
}
