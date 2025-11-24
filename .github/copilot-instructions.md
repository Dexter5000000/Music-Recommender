# Spotify Listening Stats Recommender - Development Guide

## Project Status

✅ **Scaffolding Complete**
- Fullstack project structure created
- Frontend (React + Vite + Tailwind) configured
- Backend (Express + TypeScript) configured
- Shared types module configured
- MongoDB models prepared
- All dependencies installed

## Quick Start

### 1. Start MongoDB Locally

**Windows (via PowerShell):**
```powershell
# If installed as Windows service (MSI installer)
Start-Service MongoDB

# Or run mongod directly:
& "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\MongoDB\data"
```

**macOS/Linux:**
```bash
brew services start mongodb-community
# or: mongod --dbpath ./data
```

### 2. Setup Environment Variables

Copy the example to `.env` in the `backend/` folder:
```bash
copy backend\.env.example backend\.env
```

Edit `backend/.env` and update values if needed:
- `MONGODB_URI=mongodb://localhost:27017/spotify-recommender`
- `PORT=3000`
- Optional: Add API keys for Groq, Hugging Face, SpotAPI

### 3. Install Python & GPT4All (Required)

```bash
# Install Python 3.8+ from https://www.python.org/downloads/
# Then install GPT4All:
pip install gpt4all

# Download the model (this will cache it at ~/.cache/gpt4all/):
python -c "from gpt4all import GPT4All; GPT4All()"
```

### 4. Run Development Servers

```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:3000 (Express server)
- **Health Check**: http://localhost:3000/api/health

## Project Structure

```
├── frontend/              # React 18 + Vite + Tailwind
│   ├── src/
│   │   ├── App.tsx        # Main component
│   │   ├── main.tsx       # Entry point
│   │   ├── index.css      # Tailwind + custom styles
│   │   ├── config.ts      # API configuration
│   │   └── services/
│   │       └── api.ts     # Axios API client
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── backend/               # Express + TypeScript
│   ├── src/
│   │   ├── server.ts      # Express app entry
│   │   ├── utils/
│   │   │   └── database.ts # MongoDB connection
│   │   └── models/        # Mongoose schemas (prepared)
│   │       ├── User.ts
│   │       ├── StatSubmission.ts
│   │       ├── Recommendation.ts
│   │       ├── Playlist.ts
│   │       └── Insight.ts
│   ├── uploads/           # Temp file storage
│   ├── tsconfig.json
│   └── package.json
│
├── shared/                # TypeScript types
│   ├── src/
│   │   ├── types.ts       # All shared interfaces
│   │   ├── constants.ts   # API endpoints, constants
│   │   └── index.ts       # Export everything
│   └── package.json
│
└── package.json           # Root workspace config
```

## Next Steps - Implementation Tasks

### Phase 1: Stats Ingestion (Priority: HIGH)
- [ ] Implement screenshot upload handler (image-to-text OCR)
- [ ] Implement Spotify link parser (SpotAPI integration)
- [ ] Create stats validation & normalization
- [ ] Setup upload endpoint: `POST /api/stats/upload`
- [ ] Setup link endpoint: `POST /api/stats/link`

### Phase 2: AI Recommendation Engine (Priority: HIGH)
- [ ] Setup GPT4All integration with fallback providers
- [ ] Create prompt builders for personalized recommendations
- [ ] Build rule-based playlist curation engine
- [ ] Create insights generator (genre analysis, patterns)
- [ ] Implement recommendation endpoint: `GET /api/recommendations/:submissionId`

### Phase 3: Frontend Submission Flow (Priority: HIGH)
- [ ] Build home/landing page
- [ ] Create screenshot upload component
- [ ] Create Spotify link form component
- [ ] Build results/recommendations display pages
- [ ] Add loading states and error handling

### Phase 4: Authentication & User Profiles (Priority: MEDIUM)
- [ ] Setup JWT authentication
- [ ] Create user signup/login endpoints
- [ ] Implement Spotify OAuth linking (optional via SpotAPI)
- [ ] Add user profile management
- [ ] Persist submissions to user profiles

### Phase 5: Deployment & Polish (Priority: LOW)
- [ ] Add Docker configuration (if needed)
- [ ] Setup environment-specific configs
- [ ] Add comprehensive error handling
- [ ] Performance optimizations
- [ ] Deployment to production

## Development Commands

```bash
# Development
npm run dev              # Start both frontend & backend

# Workspace individual development
npm run dev -w frontend # Just frontend dev server
npm run dev -w backend  # Just backend dev server

# Building
npm run build           # Build all packages
npm run build -w frontend
npm run build -w backend

# Linting
npm run lint           # Lint all packages
npm lint -w frontend
npm lint -w backend
```

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running (see "Start MongoDB" above).

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Change `PORT` in `.env` or kill existing process.

### Frontend Can't Connect to Backend
```
Error: Cannot reach http://localhost:3000
```
**Solution**: Ensure backend is running on port 3000, check VITE_API_URL in .env.

### GPT4All Model Not Found
**Solution**: Run `python -c "from gpt4all import GPT4All; GPT4All()"` to download model.

### Compilation Errors
```bash
npm install  # Reinstall dependencies
npm run build # Check build errors
```

## Technology Stack Summary

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MongoDB Community (local) |
| **AI** | GPT4All (primary), Groq/Hugging Face (fallback) |
| **Authentication** | JWT + bcryptjs |
| **File Upload** | Multer |
| **API Integration** | Axios, SpotAPI (optional) |

## Important Notes

- **No Docker**: Everything runs locally without Docker
- **Free Tier**: MongoDB Community Edition (0 cost)
- **Local AI**: GPT4All runs locally (no API keys needed)
- **Optional Services**: Groq, Hugging Face, Spotify API are optional for enhanced features

## Additional Resources

- MongoDB: https://docs.mongodb.com/manual/
- Express: https://expressjs.com/
- React: https://react.dev/
- Vite: https://vitejs.dev/
- GPT4All: https://www.nomic.ai/gpt4all
- SpotAPI: https://github.com/Aran404/SpotAPI

---

**Status**: Ready for feature implementation
**Last Updated**: November 23, 2025
