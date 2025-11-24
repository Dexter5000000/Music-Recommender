# Appwrite Setup Instructions

Your backend is now using Appwrite! Follow these steps to complete the setup:

## 1. Create Database in Appwrite Console

1. Go to your Appwrite console at: https://cloud.appwrite.io
2. Select your **Music Recommender** project
3. Go to **Databases** → **Create Database**
4. Name: `spotify-db`
5. Click **Create**

## 2. Create Collections

After creating the database, create these 5 collections:

### Collection 1: `submissions`
- Attributes:
  - `type` (String, required) - values: "screenshot" or "spotify-link"
  - `spotifyLink` (String, optional)
  - `imageUrl` (String, optional)
  - `topArtists` (JSON, optional)
  - `topTracks` (JSON, optional)
  - `genres` (String array, optional)
  - `status` (String, required) - values: "pending", "processing", "completed", "failed"
  - `createdAt` (DateTime, required)

### Collection 2: `recommendations`
- Attributes:
  - `submissionId` (String, required) - Document ID reference
  - `provider` (String, required) - values: "gpt4all", "groq", "huggingface"
  - `recommendations` (JSON, optional)
  - `reasoning` (String, optional)
  - `confidence` (Number, optional)

### Collection 3: `playlists`
- Attributes:
  - `submissionId` (String, required)
  - `name` (String, required)
  - `description` (String, optional)
  - `tracks` (JSON, optional)
  - `rules` (JSON, optional)

### Collection 4: `insights`
- Attributes:
  - `submissionId` (String, required)
  - `topGenres` (JSON, optional)
  - `topArtists` (JSON, optional)
  - `listeningPatterns` (JSON, optional)
  - `discovery` (JSON, optional)

### Collection 5: `users`
- Attributes:
  - `email` (String, required, unique)
  - `spotifyId` (String, optional)
  - `spotifyAccessToken` (String, optional)
  - `spotifyRefreshToken` (String, optional)
  - `submissions` (String array, optional)

## 3. Set Permissions

For each collection:
1. Go to **Settings** tab
2. Under **Permissions**, click **Custom**
3. Add:
   - `Anyone` → `Create`, `Read`
   - `Users` → `Update`, `Delete`

## 4. Test the Backend

Backend is running at `http://localhost:3000`

Test the health endpoint:
```bash
curl http://localhost:3000/api/health
```

Test upload endpoint:
```bash
curl -X POST http://localhost:3000/api/stats/upload \
  -F "image=@C:\path\to\stats.png"
```

Test link endpoint:
```bash
curl -X POST http://localhost:3000/api/stats/link \
  -H "Content-Type: application/json" \
  -d "{\"spotifyLink\": \"https://open.spotify.com/...\"}"
```

## Environment Variables

Your `.env` file in `backend/` has:
- `APPWRITE_ENDPOINT`: https://cloud.appwrite.io/v1
- `APPWRITE_PROJECT_ID`: 6923a4c00014f309f27e
- `APPWRITE_API_KEY`: (your API key)

These are already configured and ready to use!

## Next Steps

Once collections are created:
1. Frontend will auto-connect to these endpoints
2. Add recommendation engine (GPT4All integration)
3. Deploy to production (Appwrite handles hosting)
