# Quick Start Guide - Appwrite + Spotify Recommender

## 🚀 Running the App

```bash
cd C:\Users\Rhowind\Leech-Website\starter-appwrite
npm run dev
```

Opens at: **http://localhost:5174**

## ✅ Verify Connection

1. Open http://localhost:5174 in your browser
2. Click the pink **"Send a ping"** button
3. Look for green checkmark ✅ and "Congratulations!" message
4. Check the logs at the bottom to see the successful request

## 📊 Expected Response

After clicking "Send a ping", you should see:

```
Status: 200
Method: GET
Path: /v1/ping
Response: {"status": "ok"}
```

**Green checkmark** = Connection successful ✅

## 🔧 Configuration

Your `.env` file (in `starter-appwrite/` folder):

```env
VITE_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=6923a4c00014f309f27e
VITE_APPWRITE_PROJECT_NAME=Music Recommender
```

## 📚 File Locations

| File | Purpose |
|------|---------|
| `starter-appwrite/.env` | Configuration (your settings) |
| `starter-appwrite/lib/appwrite.js` | Appwrite client setup |
| `starter-appwrite/index.html` | Main UI (edit this for your app) |
| `starter-appwrite/style/app.css` | Styling |

## 🗄️ Database Setup (After Connection Works)

### 1. Go to Appwrite Console
https://cloud.appwrite.io

### 2. Select "Music Recommender" Project

### 3. Create Database
- **Databases** → **Create Database**
- Name: `spotify-db`

### 4. Create 5 Collections
See `APPWRITE_STARTER_SETUP.md` for full collection schema

### 5. Set Permissions
For each collection:
- Settings → Permissions → Custom
- Add: `Anyone` (Create, Read), `Users` (Update, Delete)

## 💡 What the Ping Test Does

The ping button tests:
1. ✅ Your internet connection
2. ✅ Appwrite cloud is accessible
3. ✅ Your Project ID is correct
4. ✅ Your configuration is valid

## ⚠️ If Ping Fails

Check logs panel at bottom:
- **Status 401** = Auth error (but server is reachable - OK for now)
- **Status 500** = Server error (check endpoint)
- **Network error** = No internet or CORS issue
- **Timeout** = Server not responding

## 🎯 Next: Building Your Features

Once ping succeeds:

1. Edit `index.html` to add Spotify stats upload UI
2. Add JavaScript to handle file uploads
3. Connect to database using the Appwrite SDK
4. Add recommendation logic
5. Display results to user

## 📦 Dependencies Installed

- `appwrite` - Appwrite SDK
- `vite` - Build tool
- All styling and utilities ready to use

## 🆘 Help

**Something not working?**
- Check browser console (F12)
- Verify `.env` file has correct values
- Make sure you're on http://localhost:5174
- Restart dev server if needed

---

**Ready?** Open http://localhost:5174 and click "Send a ping"! 🎉
