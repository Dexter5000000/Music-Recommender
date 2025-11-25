import { Client, Databases, Storage, ID } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

console.log('Initializing Appwrite client...');
const endpoint = process.env.VITE_APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.VITE_APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || '';
const apiKey = process.env.APPWRITE_API_KEY || '';

console.log('Endpoint:', endpoint);
console.log('Project ID:', projectId);

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

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
export const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'spotify-db';

export { databases, storage, ID };
export default client;
