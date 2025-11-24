# Appwrite Web Platform Setup

## ✅ Completed Steps

1. **Installed Appwrite SDK**
   ```bash
   npm install appwrite
   ```

2. **Created Environment Configuration**
   - `.env` file with Appwrite credentials
   - `.env.example` for reference

3. **Initialized Appwrite Client**
   - `src/services/appwrite.ts` - Main Appwrite initialization
   - Configured with:
     - Endpoint: `https://nyc.cloud.appwrite.io/v1`
     - Project ID: `6923a4c00014f309f27e`
     - Project Name: `Music Recommender`

4. **Created Database Service**
   - `src/services/database.ts` - Typed API for database operations
   - Includes services for:
     - Submissions (upload stats)
     - Recommendations (AI-generated)
     - Playlists (curated)
     - Insights (analysis)

5. **Added Health Check Component**
   - `src/components/AppwriteHealthCheck.tsx` - Verifies connection
   - Displays status in navbar

## 🔧 Configuration

### Environment Variables
Located in `frontend/.env`:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=6923a4c00014f309f27e
VITE_APPWRITE_PROJECT_NAME=Music Recommender

# API Configuration
VITE_API_URL=http://localhost:3000/api
```

## 📦 Database Structure

### Collections Ready to Create in Appwrite Console

#### 1. `submissions`
- `type` (String, required) - "screenshot" or "spotify-link"
- `spotifyLink` (String, optional)
- `imageUrl` (String, optional)
- `topArtists` (JSON, optional)
- `topTracks` (JSON, optional)
- `genres` (String array, optional)
- `status` (String, required) - "pending", "processing", "completed", "failed"
- `createdAt` (DateTime, required)

#### 2. `recommendations`
- `submissionId` (String, required)
- `provider` (String, required) - "gpt4all", "groq", "huggingface"
- `recommendations` (JSON, optional)
- `reasoning` (String, optional)
- `confidence` (Number, optional)

#### 3. `playlists`
- `submissionId` (String, required)
- `name` (String, required)
- `description` (String, optional)
- `tracks` (JSON, optional)
- `rules` (JSON, optional)

#### 4. `insights`
- `submissionId` (String, required)
- `topGenres` (JSON, optional)
- `topArtists` (JSON, optional)
- `listeningPatterns` (JSON, optional)
- `discovery` (JSON, optional)

#### 5. `users`
- `email` (String, required, unique)
- `spotifyId` (String, optional)
- `spotifyAccessToken` (String, optional)
- `spotifyRefreshToken` (String, optional)
- `submissions` (String array, optional)

## 🚀 Next Steps

### Step 1: Create Database (Appwrite Console)
```
1. Go to: https://cloud.appwrite.io
2. Select "Music Recommender" project
3. Go to Databases → Create Database
4. Name: "spotify-db"
```

### Step 2: Create Collections
Use the database service to guide collection creation. Each collection should match the schema above.

### Step 3: Set Permissions
For each collection in Appwrite Console:
```
Settings → Permissions
Add:
- Anyone → Create, Read
- Users → Update, Delete
```

### Step 4: Run Development Server
```bash
npm run dev
```

The health check component will appear in the navbar showing Appwrite connection status.

## 📝 API Usage Examples

### Create a Submission
```typescript
import { submissionService } from '@/services/database';

const submission = await submissionService.create({
  type: 'screenshot',
  imageUrl: 'https://example.com/image.png',
  topArtists: [...],
  genres: ['pop', 'rock']
});
```

### Get Recommendations
```typescript
import { recommendationService } from '@/services/database';

const recs = await recommendationService.getBySubmission(submissionId);
```

### List Submissions
```typescript
const submissions = await submissionService.list(25, 0); // limit, offset
```

## 🔍 Troubleshooting

### "Appwrite server is reachable (not authenticated)"
This is normal! The health check shows the server is accessible even without authentication.

### "Failed to connect to Appwrite"
1. Check internet connection
2. Verify endpoint URL is correct
3. Check browser console for CORS errors
4. Ensure Appwrite project ID is correct

### Database operations returning errors
1. Ensure collections are created in Appwrite console
2. Check database ID matches `appwriteConfig.databaseId`
3. Verify permissions are set correctly

## 📚 Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite JavaScript SDK](https://github.com/appwrite/sdk-for-web)
- [Appwrite Databases API](https://appwrite.io/docs/databases)

## 🎯 Current Status

- ✅ SDK installed and configured
- ✅ Client initialization complete
- ✅ Database service layer created
- ✅ Health check component added
- ⏳ Waiting for database creation in Appwrite console
- ⏳ Backend integration pending
