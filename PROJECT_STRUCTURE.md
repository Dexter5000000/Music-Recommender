# Project Structure - Appwrite Spotify Recommender

## Directory Layout

```
C:\Users\Rhowind\Leech-Website\
│
├── starter-appwrite/                    ⭐ OFFICIAL APPWRITE STARTER (ACTIVE)
│   ├── index.html                       ← Main app page (shows ping test)
│   ├── lib/
│   │   └── appwrite.js                  ← Appwrite client (pre-configured)
│   ├── style/
│   │   └── app.css                      ← Styling
│   ├── images/                          ← Logos and icons
│   ├── .env                             ← Configuration (SET UP ✅)
│   ├── .env.example                     ← Template
│   ├── package.json
│   ├── vite.config.js
│   └── node_modules/                    ← Dependencies installed
│
├── frontend/                            (Old - superseded by starter-appwrite)
│   ├── src/
│   │   ├── services/
│   │   │   ├── appwrite.ts
│   │   │   └── database.ts
│   │   ├── components/
│   │   │   ├── AppwriteHealthCheck.tsx
│   │   │   └── AppwriteDebug.tsx
│   │   ├── App.tsx
│   │   └── ...
│   ├── .env
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                             (Express API - running on port 3000)
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── utils/
│   ├── .env
│   └── package.json
│
├── shared/                              (Shared TypeScript types)
│   ├── src/
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   └── index.ts
│   └── package.json
│
└── Documentation Files
    ├── APPWRITE_QUICK_START.md          ← START HERE
    ├── APPWRITE_STARTER_SETUP.md        ← Full setup guide
    ├── APPWRITE_WEB_PLATFORM_SETUP.md   ← (Old version)
    ├── APPWRITE_SETUP.md                ← (Old version)
    ├── APPWRITE_QUICK_REFERENCE.md      ← (Old version)
    ├── README.md
    └── package.json (root workspace)
```

## Which One to Use?

### ✅ USE: `starter-appwrite/`
- **Official Appwrite starter kit**
- **Pre-configured with all dependencies**
- **Production-ready template**
- **Clean, modern UI**
- **Best for learning**

### ❌ DON'T USE: `frontend/` (for Appwrite)
- Old TypeScript/React setup
- Can still be used for other parts of your project
- Kept for reference if needed

## Running the App

### Official Starter (RECOMMENDED)
```bash
cd C:\Users\Rhowind\Leech-Website\starter-appwrite
npm run dev
# Opens at http://localhost:5174
```

### Old Frontend (Optional - for reference)
```bash
cd C:\Users\Rhowind\Leech-Website\frontend
npm run dev
# Opens at http://localhost:5173
```

### Backend API
```bash
cd C:\Users\Rhowind\Leech-Website\backend
npm run dev
# Runs at http://localhost:3000
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│          Browser (http://localhost:5174)            │
│      starter-appwrite (Official Appwrite)           │
│                                                      │
│  ┌──────────────────────────────────────────┐      │
│  │ index.html (Ping Test UI + Your App)     │      │
│  │ lib/appwrite.js (SDK Client)             │      │
│  │ style/app.css (Styling)                  │      │
│  └──────────────────────────────────────────┘      │
│                      │                              │
│                      │ Appwrite SDK                 │
│                      ▼                              │
└─────────────────────────────────────────────────────┘
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
    ┌─────────┐ ┌─────────┐ ┌──────────┐
    │Appwrite │ │Your API │ │Database  │
    │Cloud    │ │Backend  │ │Collections
    │(Ping)   │ │:3000    │ │(Ready)   │
    └─────────┘ └─────────┘ └──────────┘
```

## Current Status

| Component | Status | Port | Details |
|-----------|--------|------|---------|
| Appwrite Starter | ✅ Running | 5174 | Ping test ready |
| Backend API | ✅ Running | 3000 | Express server |
| Old Frontend | Stopped | 5173 | Can start if needed |
| Appwrite Cloud | ✅ Connected | Cloud | Configuration verified |

## What's Configured

✅ `.env` file with Appwrite credentials  
✅ Appwrite SDK installed  
✅ Dev server running  
✅ Ping test ready  
✅ Console logging setup  
✅ Project info display  

## What's Next

1. **Test Connection** - Click "Send a ping" button
2. **Create Database** - Go to Appwrite console, create `spotify-db`
3. **Create Collections** - Add 5 collections for your data
4. **Set Permissions** - Configure access rules
5. **Edit UI** - Modify `index.html` for Spotify upload form
6. **Add Logic** - Write JavaScript to handle submissions
7. **Connect Backend** - Link to Express API on port 3000

## Useful Commands

```bash
# Navigate to starter
cd C:\Users\Rhowind\Leech-Website\starter-appwrite

# Start dev server
npm run dev

# Build for production
npm run build

# Stop dev server
# Press Ctrl+C in terminal
```

## File to Edit for Your App

**`starter-appwrite/index.html`**
- Replace the ping test section with your Spotify stats form
- Keep the logs panel for debugging
- Reference `lib/appwrite.js` for SDK usage

---

**Status:** Project structure ready for development  
**Active App:** starter-appwrite on http://localhost:5174  
**Last Updated:** November 23, 2025
