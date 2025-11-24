export const API_ENDPOINTS = {
  STATS: {
    UPLOAD: '/api/stats/upload',
    LINK: '/api/stats/link',
    GET: '/api/stats/:id',
  },
  RECOMMENDATIONS: {
    GET: '/api/recommendations/:submissionId',
  },
  PLAYLISTS: {
    GET: '/api/playlists/:submissionId',
  },
  INSIGHTS: {
    GET: '/api/insights/:submissionId',
  },
  AUTH: {
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
    SPOTIFY_LINK: '/api/auth/spotify-link',
    LOGOUT: '/api/auth/logout',
  },
};

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export const AI_PROVIDERS = {
  GPT4ALL: 'gpt4all',
  GROQ: 'groq',
  HUGGINGFACE: 'huggingface',
};

export const SUBMISSION_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
};
