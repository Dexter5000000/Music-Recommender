# Spotify Listening Stats Recommender

An AI-powered website that analyzes your Spotify listening stats and provides personalized music recommendations, curated playlists, and listening insights.

## Features

- 📊 **Upload Listening Stats**: Share via screenshot or Spotify shareable link
- 🤖 **AI Recommendations**: GPT4All-powered personalized song recommendations
- 🎵 **Curated Playlists**: Rule-based playlist generation based on your taste
- 📈 **Listening Insights**: Genre breakdowns, listening patterns, and stats analysis
- 🔗 **Optional Spotify Linking**: Link your Spotify account for enhanced features
- 🚀 **No Account Required**: Get started immediately without registration

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB Community Edition (local)
- **AI**: GPT4All (primary) with Groq & Hugging Face fallbacks
- **File Processing**: Multer for image uploads, image-to-text for screenshot parsing
- **API Integration**: SpotAPI for Spotify link parsing

## Prerequisites

Before you start, install:

1. **Node.js** (v18+): https://nodejs.org/
2. **MongoDB Community Edition** (local): https://www.mongodb.com/try/download/community
3. **Python 3.8+** (required by GPT4All): https://www.python.org/downloads/

## Local Setup

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Dexter5000000/Music-Recommender.git
cd Music-Recommender
npm install
```

### 2. Start MongoDB Locally

**Windows:**
```powershell
# If installed via MSI, MongoDB is already running as a service
# Verify it's running:
Get-Service MongoDB | Select-Object Status
```

**macOS/Linux:**
```bash
# If installed via Homebrew
brew services start mongodb-community
```

**Or run mongod directly:**
```bash
mongod --dbpath ./data
```

### 3. Setup Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/spotify-recommender

# API Keys (optional)
GROQ_API_KEY=your_groq_key_here
HUGGINGFACE_API_KEY=your_huggingface_key_here

# SpotAPI (optional, for Spotify link parsing)
SPOTAPI_USER=your_spotapi_user
SPOTAPI_PASS=your_spotapi_pass

# JWT Secret (for optional auth)
JWT_SECRET=your_jwt_secret_here

# Server
PORT=3000
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3000/api
```

### 4. Download GPT4All Model

```bash
# Python is required for this
pip install gpt4all

# Download the default model (Mistal 7B)
python -c "from gpt4all import GPT4All; GPT4All()" 
```

The model will be downloaded to `~/.cache/gpt4all/` (this is automatic).

### 5. Run Development Servers

```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:3000 (Express server)

## Project Structure

```
spotify-listening-stats-recommender/
├── frontend/                 # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API calls
│   │   ├── styles/           # Tailwind config
│   │   └── App.tsx           # Root component
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                  # Express + TypeScript
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Express middleware
│   │   ├── utils/            # Utilities
│   │   └── server.ts         # Express app entry
│   ├── uploads/              # Temporary file storage
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                   # Shared TypeScript types
│   ├── src/
│   │   ├── types/            # Shared interfaces/types
│   │   └── constants/        # Shared constants
│   └── package.json
│
├── package.json              # Root workspace config
└── README.md                 # This file
```

## API Endpoints

### Stats Submission
- `POST /api/stats/upload` - Upload listening stats screenshot
- `POST /api/stats/link` - Submit Spotify shareable link
- `GET /api/stats/:id` - Get submission details

### Recommendations
- `GET /api/recommendations/:submissionId` - Get AI recommendations
- `GET /api/playlists/:submissionId` - Get curated playlists

### Insights
- `GET /api/insights/:submissionId` - Get listening insights

### Auth (Optional)
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/spotify-link` - Link Spotify account

## Development Workflow

### Frontend Development
```bash
cd frontend
npm run dev
```
Vite will hot-reload on file changes.

### Backend Development
```bash
cd backend
npm run dev
```
Uses `ts-node` with watch mode for auto-restart.

### Build for Production
```bash
npm run build
```

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running locally (see "Start MongoDB" above).

### GPT4All Model Not Found
```
Error: Model not found at ~/.cache/gpt4all/
```
**Solution**: Run `python -c "from gpt4all import GPT4All; GPT4All()"` to download the default model.

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Change `PORT` in `.env` or kill the process using the port.

### Image Upload Issues
Make sure the `backend/uploads/` directory exists and is writable.

## Dependencies Overview

### Frontend
- **react**: UI framework
- **vite**: Build tool
- **tailwindcss**: Styling
- **typescript**: Type safety
- **react-query** or **swr**: Data fetching
- **axios**: HTTP client

### Backend
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **typescript**: Type safety
- **multer**: File uploads
- **gpt4all**: Local AI model
- **groq-sdk**: Groq API (fallback)
- **huggingface-js**: Hugging Face API (fallback)

### Shared
- **typescript**: Type definitions

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a pull request

## License

MIT

## Next Steps

- [ ] Initialize frontend with Vite + React + Tailwind
- [ ] Setup backend with Express + MongoDB + Mongoose
- [ ] Implement image processing for screenshot uploads
- [ ] Integrate SpotAPI for Spotify link parsing
- [ ] Build AI recommendation engine with GPT4All
- [ ] Create React UI for submission and results
- [ ] Add optional authentication with Spotify OAuth
- [ ] Deploy to production

---

**Questions?** Check the issue tracker or reach out to the maintainers.
