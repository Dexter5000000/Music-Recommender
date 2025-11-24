import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Landing from './pages/Landing';
import AppwriteHealthCheck from './components/AppwriteHealthCheck';
import AppwriteDebug from './components/AppwriteDebug';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page as default */}
        <Route path="/" element={<Landing />} />
        
        {/* App page with original components */}
        <Route
          path="/app"
          element={
            <div className="min-h-screen bg-gradient-to-br from-green-900 to-black">
              <nav className="bg-black bg-opacity-80 backdrop-blur sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎵</span>
                      <h1 className="text-xl font-bold text-white">Spotify Stats Recommender</h1>
                    </div>
                    <div className="text-sm text-gray-400">
                      Discover music based on your listening stats
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Status:</span>
                    <AppwriteHealthCheck />
                  </div>
                </div>
              </nav>

              <main className="container mx-auto px-4 py-8">
                <div className="text-center py-20">
                  <h2 className="text-4xl font-bold mb-4">🎵 Welcome!</h2>
                  <p className="text-xl text-gray-300 mb-8">
                    Get personalized music recommendations based on your Spotify listening stats
                  </p>
                  <p className="text-gray-400 mb-8">Routes and pages coming soon...</p>
                  <div className="mt-12 max-w-2xl mx-auto">
                    <AppwriteDebug />
                  </div>
                </div>
              </main>
            </div>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
