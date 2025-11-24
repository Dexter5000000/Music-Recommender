export const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api';

export const endpoints = {
  STATS: {
    UPLOAD: `${API_BASE_URL}/stats/upload`,
    LINK: `${API_BASE_URL}/stats/link`,
    GET: (id: string) => `${API_BASE_URL}/stats/${id}`,
  },
  RECOMMENDATIONS: {
    GET: (submissionId: string) => `${API_BASE_URL}/recommendations/${submissionId}`,
  },
  PLAYLISTS: {
    GET: (submissionId: string) => `${API_BASE_URL}/playlists/${submissionId}`,
  },
  INSIGHTS: {
    GET: (submissionId: string) => `${API_BASE_URL}/insights/${submissionId}`,
  },
};
