# 🎵 Spotify Music Recommender

An AI-powered music recommendation platform that analyzes your Spotify listening stats and delivers personalized song recommendations. Built with React, Express, TypeScript, and the ReccoBeats API.

**[Live Website](http://localhost:5173)** | **[Backend API](http://localhost:3000)** | **[Documentation](#-api-documentation)**

---

## ✨ Features

- 🤖 **AI-Powered Recommendations** - Advanced ReccoBeats API analyzes audio features to suggest songs perfectly tailored to you
- ⚡ **Instant Results** - Get recommendations in seconds. Just upload your Spotify stats or share a playlist link
- 🎵 **Christian Music Specialist** - Optimized for Christian music genres including worship, hip-hop, pop, and indie
- 🌈 **Modern Web Interface** - Beautiful, responsive landing page and app built with React and Tailwind CSS
- 📊 **Audio Feature Analysis** - Targets valence (happiness), energy, danceability, and more
- 🔐 **Secure Backend** - Express.js API with Appwrite Cloud database integration
- 📱 **Mobile Ready** - Fully responsive design works on all devices
- 🚀 **Real-time API Integration** - Live ReccoBeats API for actual song recommendations
- 🔗 **Spotify Integration** - Parse real Spotify playlists with SpotAPI to extract track data and artist information

---

## 🎯 How It Works

### 1. **User Submission**
- User uploads Spotify screenshot or shares playlist/track link
- Frontend validates and sends to backend

### 2. **Spotify Link Parsing (SpotAPI)**
- If user provided a Spotify link, backend extracts real track data
- Parses playlist URLs to get track titles, artists, and metadata
- Falls back to text description if parsing fails

### 3. **Genre & Mood Detection**
- Backend analyzes submission content (from text or extracted tracks)
- Detects music preferences (Christian pop, hip-hop, indie, etc.)
- Identifies mood (uplifting, worshipful, reflective, energetic)
- Extracts artist information for better seed track selection

### 4. **Audio Feature Targeting**
- System calculates target audio features:
  - **Valence**: 0.75 (uplifting, positive mood)
  - **Energy**: 0.65 (moderate-high engagement)
  - **Danceability**: 0.6 (rhythm quality)

### 5. **ReccoBeats API Call**
- Selects seed tracks matching detected genre
- Calls: `GET /v1/track/recommendation?seeds=...&size=10&valence=0.75&energy=0.65`
- Receives 10 real song recommendations

### 6. **Playlist Creation**
- Formats API response into two curated playlists:
  - **Main Playlist**: Top 5 recommendations
  - **Deep Dive**: Discover more tracks
- Each song includes title, artist, genre, recommendation reason

### 7. **Data Persistence**
- Stores results in Appwrite Cloud database
- Includes metadata about Spotify tracks if parsed

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm
- **Appwrite Cloud** account (free tier available at https://cloud.appwrite.io)
- **Git** for version control

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/spotify-recommender.git
cd spotify-recommender
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install workspace dependencies
npm install -w frontend -w backend -w shared
```

### 3. Configure Environment Variables

**Frontend** (create `frontend/.env`):
```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_PROJECT_NAME=Music Recommender
```

**Backend** (create `backend/.env`):
```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
PORT=3000
NODE_ENV=development
```

### 4. Start Development Servers

```bash
npm run dev
```

This starts both:
- **Frontend**: http://localhost:5173 (Landing page + App)
- **Backend**: http://localhost:3000 (API server)

### 5. Test the App

1. Open http://localhost:5173
2. Click "Get Started" 
3. Choose "Spotify Link" option
4. Paste a Spotify playlist URL
5. Click "Get Recommendations"
6. View personalized recommendations!

---

## 🏗️ Project Structure

```
spotify-recommender/
├── frontend/                        # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/
│   │   │   └── Landing.tsx         # Beautiful landing page
│   │   ├── components/
│   │   │   ├── AppwriteHealthCheck.tsx
│   │   │   └── AppwriteDebug.tsx
│   │   ├── services/
│   │   │   ├── api.ts              # Axios API client
│   │   │   └── appwrite.ts         # Appwrite SDK
│   │   ├── App.tsx                 # Main app with routing
│   │   ├── main.tsx                # React entry point
│   │   └── index.css               # Tailwind styles
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                         # Express + TypeScript
│   ├── src/
│   │   ├── server.ts               # Express server entry
│   │   ├── routes/
│   │   │   ├── recommendationsRoutes.ts  # Recommendations API
│   │   │   └── statsRoutes.ts           # Stats handling
│   │   ├── services/
│   │   │   ├── reccoBeatsService.ts     # Music recommendations (ReccoBeats API)
│   │   │   ├── spotifyDataService.ts    # Spotify data extraction (SpotAPI wrapper)
│   │   │   ├── spotifyLinkParser.py     # SpotAPI integration (Python)
│   │   │   └── recommendationService.ts # Legacy recommendations
│   │   ├── controllers/
│   │   │   └── statsController.ts
│   │   ├── utils/
│   │   │   └── appwrite.ts         # Appwrite client
│   │   └── middleware/             # Express middleware
│   ├── tsconfig.json
│   └── package.json
│
├── shared/                          # Shared TypeScript types
│   ├── src/
│   │   ├── types.ts                # API & data types
│   │   ├── constants.ts            # API endpoints
│   │   └── index.ts                # Exports
│   └── package.json
│
├── starter-appwrite/                # Appwrite starter kit (form interface)
│   └── index.html                  # Main form for submissions
│
├── .github/
│   └── copilot-instructions.md      # Development guide
│
├── package.json                     # Root workspace config
└── README.md                        # This file
```

---

## 🔌 API Documentation

### Base URLs
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **ReccoBeats**: https://api.reccobeats.com/v1

### Endpoints

#### 🏥 Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok"
}
```

#### 🎵 Get Recommendations
```http
POST /api/recommendations/:submissionId
Content-Type: application/json

{
  "content": "spotify playlist url or music preference description"
}
```

**Response:**
```json
{
  "success": true,
  "submissionId": "6923d573003d6bd43d56",
  "recommendations": [
    {
      "name": "Christian Pop Mix",
      "description": "Your personalized Christian music picks",
      "songs": [
        {
          "title": "I'm With You",
          "artist": "Snazzy",
          "genre": "christian pop",
          "reason": "Recommended for uplifting christian pop listening - Track #1"
        }
      ],
      "mood": "uplifting",
      "confidence": 0.95
    }
  ],
  "genres": ["christian-pop"],
  "moods": ["uplifting"],
  "reasoning": "Curated christian-pop recommendations with uplifting characteristics",
  "spotifyData": {
    "artists": ["Hillsong United", "Newsboys"],
    "genres": ["christian-pop"],
    "avgPopularity": 72
  },
  "generatedAt": "2025-11-24T03:52:00.000Z"
}
```

---

## 📊 Technology Stack

| Component | Technology |
|-----------|-----------|
| **Frontend Framework** | React 18 |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **Language** | TypeScript |
| **Router** | React Router DOM |
| **Backend Framework** | Express.js |
| **Backend Language** | TypeScript |
| **Database** | Appwrite Cloud |
| **Recommendations API** | ReccoBeats |
| **Spotify Integration** | SpotAPI |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |

---

## 🎨 Landing Page

The application includes a professional landing page with:

- **Hero Section** - Eye-catching tagline and call-to-action buttons
- **Features Showcase** - Highlights 3 key features with icons
- **How-It-Works Guide** - 4-step visual process
- **CTA Section** - Call-to-action for users to get started
- **Footer** - Links, product info, and social connections

**Access:** http://localhost:5173

---

## 🧪 Testing

### Test the Complete Workflow

1. **Start the application**
   ```bash
   npm run dev
   ```

2. **Submit a Spotify link**
   - Go to http://localhost:5173
   - Click "Get Started" button
   - Select "Spotify Link" 
   - Paste any Spotify playlist URL
   - Click "Get Recommendations"

3. **View recommendations**
   - Check the results section for generated playlists
   - Each song shows title, artist, genre, and reason

4. **Check backend logs**
   ```
   [SPOTAPI] Successfully parsed Spotify link: playlist with 50 tracks
   [API] Extracted genres: christian-pop, pop
   [API] Top artists: Hillsong United, Newsboys
   [RECCOBEATS] Detected genres: christian-pop
   [RECCOBEATS] Detected moods: uplifting
   [RECCOBEATS] Got 9 recommendations from API
   [API] Recommendations generated successfully
   ```

### Example Spotify URLs to Test

- Playlist: `https://open.spotify.com/playlist/37i9dQZF1FoyQGyinuuvRu`
- Track: `https://open.spotify.com/track/7uax1a1G4cg1GgokfakTnN`
- Direct link with tracks: `https://open.spotify.com/playlist/YOUR_PLAYLIST_ID`

---

## 🔗 SpotAPI Integration

The platform now includes **SpotAPI** for seamless Spotify integration:

### What SpotAPI Does
- **Extracts real track data** from Spotify playlists without requiring authentication
- **Parses playlist URLs** to get artist names, track titles, and metadata
- **Searches Spotify tracks** to find similar music
- **No API keys required** - Works with free Spotify access

### How It Works
1. User submits a Spotify link (playlist, track, or album)
2. SpotAPI parses the URL and extracts track information
3. System analyzes genres and artists from extracted data
4. ReccoBeats API generates recommendations using extracted seeds
5. Results are personalized based on actual user's Spotify library

### Setup SpotAPI
SpotAPI is already installed during `npm install`. No additional configuration needed!

**Example: Parse a Spotify Playlist**
```typescript
import { SpotifyDataService } from './services/spotifyDataService';

const tracks = await SpotifyDataService.parseSpotifyLink(
  'https://open.spotify.com/playlist/37i9dQZF1FoyQGyinuuvRu'
);

// Returns: [
//   { id: '...', title: 'Track Name', artist: 'Artist Name', ... },
//   { id: '...', title: 'Another Track', artist: 'Another Artist', ... },
// ]
```

---

## 🔐 Environment Variables

### Frontend (.env)

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_PROJECT_NAME=Music Recommender
```

### Backend (.env)

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id

# Server Configuration
PORT=3000
NODE_ENV=development
```

---

## 🚀 Development Commands

```bash
# Start both frontend and backend
npm run dev

# Start only frontend
npm run dev -w frontend

# Start only backend
npm run dev -w backend

# Build all packages
npm run build

# Build frontend only
npm run build -w frontend

# Lint all packages
npm run lint

# Git operations
git status
git add .
git commit -m "Your message"
git push
```

---

## 🌱 Future Enhancements

- [ ] User authentication with Spotify OAuth
- [ ] Personalized user profiles and history
- [ ] Playlist export to Spotify integration
- [ ] Advanced filtering (exclude artists/genres)
- [ ] Recommendation sharing (social media)
- [ ] Mobile app (React Native)
- [ ] Artist discovery recommendations
- [ ] Community playlists
- [ ] Analytics dashboard
- [ ] Email notifications for new recommendations

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📞 Support & Contact

For issues, questions, or feedback:

- 📧 **Email**: support@spotify-recommender.local
- 💬 **Discord**: [Community Server](https://discord.gg/spotify-recommender)
- 📖 **Docs**: Check `.github/copilot-instructions.md`
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **ReccoBeats API** - Music recommendation engine with audio feature analysis
- **Appwrite** - Open-source backend platform
- **Spotify** - Music platform and APIs
- **React & Vite** - Modern frontend stack
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

---

## 📈 Project Status

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: November 24, 2025

### What's Working ✅
- Landing page with marketing content
- Form submission (screenshot & Spotify link)
- ReccoBeats API integration
- Audio feature targeting (valence, energy, danceability)
- Recommendation generation
- Two-playlist format with song details
- Appwrite database persistence
- Full TypeScript support
- Git version control

### In Progress 🔄
- Audio feature extraction from uploaded screenshots
- Advanced Spotify URL parsing

### Coming Soon 📋
- User authentication
- User profiles and history
- Spotify export integration
- Community features

---

**Built with ❤️ for music lovers everywhere**

For the latest updates, check out the [GitHub repository](https://github.com/your-repo/spotify-recommender).
