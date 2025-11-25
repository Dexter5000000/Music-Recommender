// Polyfill fetch for Appwrite SDK - ensure global fetch is available
if (!globalThis.fetch) {
  const nodeFetch = require('node-fetch');
  globalThis.fetch = nodeFetch.default || nodeFetch;
  globalThis.Request = nodeFetch.Request;
  globalThis.Response = nodeFetch.Response;
  globalThis.Headers = nodeFetch.Headers;
}

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

console.log('[SERVER] Starting initialization...');
console.log('[SERVER] Setting up middleware...');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.path}`);
  next();
});

console.log('[SERVER] Middleware setup complete');

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running with Appwrite' });
});

console.log('[SERVER] Health check route registered');

// Test route (no Appwrite dependency)
app.post('/api/test', (req, res) => {
  console.log('[TEST] Received test request:', req.body);
  res.status(201).json({ message: 'Test successful', received: req.body });
});

console.log('[SERVER] Test route registered');

// Import and register stats routes
try {
  console.log('[SERVER] Importing stats routes...');
  const statsRoutes = require('./routes/statsRoutes').default;
  console.log('[SERVER] Stats routes imported successfully');
  app.use('/api/stats', statsRoutes);
  console.log('[SERVER] Stats routes registered');
} catch (err: any) {
  console.error('[ERROR] Failed to import stats routes:', err.message);
  console.error('[ERROR] Stack trace:', err.stack);
}

// Import and register recommendations routes
try {
  console.log('[SERVER] Importing recommendations routes...');
  const recommendationsRoutes = require('./routes/recommendationsRoutes').default;
  console.log('[SERVER] Recommendations routes imported successfully');
  app.use('/api/recommendations', recommendationsRoutes);
  console.log('[SERVER] Recommendations routes registered');
} catch (err: any) {
  console.error('[ERROR] Failed to import recommendations routes:', err.message);
  console.error('[ERROR] Stack trace:', err.stack);
}

// Import and register Christian artists routes
try {
  console.log('[SERVER] Importing Christian artists routes...');
  const christianArtistsRoutes = require('./routes/christianArtistsRoutes').default;
  console.log('[SERVER] Christian artists routes imported successfully');
  app.use('/api/christian-artists', christianArtistsRoutes);
  console.log('[SERVER] Christian artists routes registered');
} catch (err: any) {
  console.error('[ERROR] Failed to import Christian artists routes:', err.message);
  console.error('[ERROR] Stack trace:', err.stack);
}

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error('[ERROR] Request error:', err.message);
    console.error('[ERROR] Stack:', err.stack);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
);

// 404 handler
app.use((req, res) => {
  console.log('[WARN] 404 - Route not found:', req.method, req.path);
  res.status(404).json({ error: 'Route not found' });
});

console.log('[SERVER] Error handlers registered, starting server...');

// Start server with explicit options
console.log(`[SERVER] Attempting to bind to port ${PORT}...`);
console.log('[SERVER] Creating server object...');

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('[SERVER] === CALLBACK EXECUTED ===');
  const addr = server.address();
  console.log(`\n🎵 Spotify Recommender Backend`);
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`\n✅ Server successfully bound to port ${PORT}`);
  console.log(`Server address: ${JSON.stringify(addr)}\n`);
  console.log(`Also accessible from your network at http://YOUR_PC_IP:${PORT}\n`);
});

console.log('[SERVER] Attached listeners to server object');

server.on('connection', (socket) => {
  console.log('[SERVER] === NEW CONNECTION RECEIVED ===');
  console.log('[SERVER] Remote address:', socket.remoteAddress);
});

server.on('request', (req, res) => {
  console.log('[SERVER] === REQUEST RECEIVED ===');
  console.log('[SERVER] Method:', req.method, 'Path:', req.url);
});

server.on('clientError', (err, socket) => {
  console.error('[SERVER] CLIENT ERROR:', err.message);
  console.error('[SERVER] Stack:', err.stack);
});

server.on('error', (err: any) => {
  console.error('[ERROR] Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`[ERROR] Port ${PORT} is already in use`);
  }
  process.exit(1);
});

process.on('uncaughtException', (err: any) => {
  console.error('[FATAL] Uncaught Exception:', err.message);
  console.error('[FATAL] Stack:', err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any) => {
  console.error('[FATAL] Unhandled Rejection:', reason);
});

export default app;
