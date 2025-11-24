import axios from 'axios';
import { API_BASE_URL } from '../config';
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const api = {
    uploadScreenshot: (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return apiClient.post('/stats/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    submitSpotifyLink: (spotifyLink) => {
        return apiClient.post('/stats/link', { spotifyLink });
    },
    getStats: (id) => {
        return apiClient.get(`/stats/${id}`);
    },
    getRecommendations: (submissionId) => {
        return apiClient.get(`/recommendations/${submissionId}`);
    },
    getPlaylists: (submissionId) => {
        return apiClient.get(`/playlists/${submissionId}`);
    },
    getInsights: (submissionId) => {
        return apiClient.get(`/insights/${submissionId}`);
    },
};
export default apiClient;
