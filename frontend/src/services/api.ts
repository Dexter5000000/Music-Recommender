import axios from 'axios';
import { API_BASE_URL } from '../config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  uploadScreenshot: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/stats/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  submitSpotifyLink: (spotifyLink: string) => {
    return apiClient.post('/stats/link', { spotifyLink });
  },

  getStats: (id: string) => {
    return apiClient.get(`/stats/${id}`);
  },

  getRecommendations: (submissionId: string) => {
    return apiClient.get(`/recommendations/${submissionId}`);
  },

  getPlaylists: (submissionId: string) => {
    return apiClient.get(`/playlists/${submissionId}`);
  },

  getInsights: (submissionId: string) => {
    return apiClient.get(`/insights/${submissionId}`);
  },
};

export default apiClient;
