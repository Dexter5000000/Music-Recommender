import { Client, Databases, Storage, ID } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

console.log('Initializing Appwrite client...');
console.log('Endpoint:', process.env.APPWRITE_ENDPOINT);
console.log('Project ID:', process.env.APPWRITE_PROJECT_ID);

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

console.log('✓ Appwrite client initialized');

const databases = new Databases(client);
const storage = new Storage(client);

// Collection IDs
export const COLLECTIONS = {
  SUBMISSIONS: 'submissions',
  RECOMMENDATIONS: 'recommendations',
  PLAYLISTS: 'playlists',
  INSIGHTS: 'insights',
  USERS: 'users',
};

// Database ID
export const DATABASE_ID = 'spotify-db';

export { databases, storage, ID };
export default client;
