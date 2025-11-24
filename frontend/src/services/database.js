import { databases, appwriteConfig } from './appwrite';
import { ID, Query } from 'appwrite';
const { databaseId, collections } = appwriteConfig;
/**
 * Submission operations
 */
export const submissionService = {
    async create(data) {
        return databases.createDocument(databaseId, collections.submissions, ID.unique(), {
            ...data,
            status: 'pending',
            createdAt: new Date().toISOString(),
        });
    },
    async get(submissionId) {
        return databases.getDocument(databaseId, collections.submissions, submissionId);
    },
    async update(submissionId, data) {
        return databases.updateDocument(databaseId, collections.submissions, submissionId, data);
    },
    async list(limit = 25, offset = 0) {
        return databases.listDocuments(databaseId, collections.submissions, [Query.limit(limit), Query.offset(offset)]);
    },
};
/**
 * Recommendation operations
 */
export const recommendationService = {
    async create(data) {
        return databases.createDocument(databaseId, collections.recommendations, ID.unique(), data);
    },
    async getBySubmission(submissionId) {
        return databases.listDocuments(databaseId, collections.recommendations, [Query.equal('submissionId', submissionId)]);
    },
};
/**
 * Playlist operations
 */
export const playlistService = {
    async create(data) {
        return databases.createDocument(databaseId, collections.playlists, ID.unique(), data);
    },
    async getBySubmission(submissionId) {
        return databases.listDocuments(databaseId, collections.playlists, [Query.equal('submissionId', submissionId)]);
    },
};
/**
 * Insight operations
 */
export const insightService = {
    async create(data) {
        return databases.createDocument(databaseId, collections.insights, ID.unique(), data);
    },
    async getBySubmission(submissionId) {
        return databases.listDocuments(databaseId, collections.insights, [Query.equal('submissionId', submissionId)]);
    },
};
