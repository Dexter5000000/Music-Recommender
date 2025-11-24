# Quick Reference: Appwrite Web Setup

## 🚀 Running the App

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Look for green status badge in navbar

## 📝 Environment Variables

**File:** `frontend/.env`

```env
VITE_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=6923a4c00014f309f27e
VITE_APPWRITE_PROJECT_NAME=Music Recommender
VITE_API_URL=http://localhost:3000/api
```

## 🗄️ Database Setup Checklist

- [ ] Create `spotify-db` database in Appwrite console
- [ ] Create `submissions` collection
- [ ] Create `recommendations` collection
- [ ] Create `playlists` collection
- [ ] Create `insights` collection
- [ ] Create `users` collection
- [ ] Set permissions for all collections (Anyone: Create/Read, Users: Update/Delete)

## 📚 Using the Database

### Import Services
```typescript
import { submissionService, recommendationService, playlistService, insightService } from '@/services/database';
```

### Create a Submission
```typescript
const doc = await submissionService.create({
  type: 'screenshot',
  imageUrl: 'url',
  genres: ['pop']
});
```

### Get Submissions
```typescript
const { documents } = await submissionService.list();
```

### Get Single Submission
```typescript
const doc = await submissionService.get(id);
```

### Update Submission
```typescript
await submissionService.update(id, { status: 'completed' });
```

### Create Recommendation
```typescript
const rec = await recommendationService.create({
  submissionId: id,
  provider: 'gpt4all',
  confidence: 0.95
});
```

### Get Recommendations
```typescript
const { documents } = await recommendationService.getBySubmission(submissionId);
```

## 🔗 Key Files

| File | Purpose |
|------|---------|
| `frontend/.env` | Appwrite credentials |
| `frontend/src/services/appwrite.ts` | Client initialization |
| `frontend/src/services/database.ts` | Database operations |
| `frontend/src/components/AppwriteHealthCheck.tsx` | Connection status |

## ❌ Troubleshooting

| Issue | Solution |
|-------|----------|
| Health check red | Check Appwrite endpoint URL |
| CORS error | Restart both dev servers |
| DB operations fail | Create collections in Appwrite console |
| Env vars not loaded | Restart dev server |
| Port already in use | Change PORT in backend `.env` |

## 📚 Documentation Links

- [Appwrite Console](https://cloud.appwrite.io)
- [Appwrite Docs](https://appwrite.io/docs)
- [JavaScript SDK](https://github.com/appwrite/sdk-for-web)
- [Database Guide](https://appwrite.io/docs/databases)

---

**Project:** Spotify Listening Stats Recommender  
**Status:** Ready for development  
**Updated:** November 23, 2025
