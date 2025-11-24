// ============ Submission Types ============

export type SubmissionType = 'screenshot' | 'spotify-link';

export interface StatSubmission {
  _id?: string;
  type: SubmissionType;
  userId?: string; // Optional if user is not authenticated
  // Screenshot specific
  imageUrl?: string;
  // Spotify link specific
  spotifyLink?: string;
  // Parsed data
  topArtists: Artist[];
  topTracks: Track[];
  genres: string[];
  // Metadata
  createdAt?: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
}

// ============ Music Types ============

export interface Artist {
  name: string;
  rank?: number;
  listeners?: number;
  genres?: string[];
}

export interface Track {
  name: string;
  artist: string;
  rank?: number;
  genre?: string;
  spotifyUrl?: string;
}

export interface Genre {
  name: string;
  count: number;
  percentage: number;
}

// ============ Recommendation Types ============

export interface Recommendation {
  _id?: string;
  submissionId: string;
  provider: 'gpt4all' | 'groq' | 'huggingface';
  recommendations: RecommendedTrack[];
  reasoning: string;
  confidence: number;
  createdAt?: Date;
}

export interface RecommendedTrack {
  name: string;
  artist: string;
  genre?: string;
  reason: string;
  spotifyUrl?: string;
  score: number; // 0-100
}

// ============ Playlist Types ============

export interface Playlist {
  _id?: string;
  submissionId: string;
  name: string;
  description: string;
  tracks: Track[];
  rules: PlaylistRule[];
  createdAt?: Date;
}

export interface PlaylistRule {
  type: 'genre' | 'artist' | 'mood' | 'tempo';
  value: string;
}

// ============ Insights Types ============

export interface Insight {
  _id?: string;
  submissionId: string;
  topGenres: Genre[];
  topArtists: Artist[];
  listeningPatterns: ListeningPattern;
  discovery: DiscoveryMetrics;
  createdAt?: Date;
}

export interface ListeningPattern {
  artistDiversity: number; // 0-100
  genreDiversity: number; // 0-100
  newMusic: number; // Percentage of new/less known artists
  favoriteArtistRepeat: number; // How much top artist dominates
}

export interface DiscoveryMetrics {
  mainGenre: string;
  subGenres: string[];
  recommendedGenres: string[];
  similarArtists: string[];
}

// ============ User Types ============

export interface User {
  _id?: string;
  email: string;
  passwordHash?: string; // Optional for OAuth-only users
  spotifyId?: string;
  spotifyAccessToken?: string;
  spotifyRefreshToken?: string;
  createdAt?: Date;
  submissions?: string[]; // Array of submission IDs
}

// ============ API Request/Response Types ============

export interface UploadStatsRequest {
  // Multipart form data with 'image' field
  image?: any; // Multer File type
}

export interface LinkStatsRequest {
  spotifyLink: string;
}

export interface StatsResponse {
  submission: StatSubmission;
  recommendations?: Recommendation;
  playlists?: Playlist[];
  insights?: Insight;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

// ============ Auth Types ============

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SpotifyLinkRequest {
  authCode: string; // OAuth code from Spotify
}
