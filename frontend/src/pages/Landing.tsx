import React from 'react';
import { ArrowRight, Music, Sparkles, Zap, Users, Github, ExternalLink } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/30 backdrop-blur-md border-b border-purple-500/20 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Music className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold text-white">Spotify Recommender</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition">How It Works</a>
            <a href="#" className="text-gray-300 hover:text-white transition">Docs</a>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="bg-purple-500/20 border border-purple-500/50 text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
              🎵 AI-Powered Music Discovery
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Discover Your Next
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Favorite Songs</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Share your Spotify listening stats and get personalized music recommendations powered by AI. 
            Perfect for Christian music lovers and anyone seeking new tracks tailored to their taste.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="/app" className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-semibold transition transform hover:scale-105">
              Launch App <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center border border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-white px-8 py-4 rounded-lg font-semibold transition">
              <Github className="w-5 h-5 mr-2" /> View on GitHub
            </a>
          </div>

          {/* Hero Image/Demo */}
          <div className="relative mt-16">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl rounded-2xl"></div>
            <div className="relative bg-black/40 backdrop-blur border border-purple-500/20 rounded-2xl p-8">
              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <Music className="w-24 h-24 text-purple-400 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-400">App Interface Demo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Powerful Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-black/40 backdrop-blur border border-purple-500/20 rounded-lg p-8 hover:border-purple-500/50 transition">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Recommendations</h3>
              <p className="text-gray-400">
                Advanced algorithms analyze your music taste and suggest songs perfectly tailored to you.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-black/40 backdrop-blur border border-purple-500/20 rounded-lg p-8 hover:border-purple-500/50 transition">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Instant Results</h3>
              <p className="text-gray-400">
                Get recommendations in seconds. Just upload your Spotify stats or share a playlist link.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-black/40 backdrop-blur border border-purple-500/20 rounded-lg p-8 hover:border-purple-500/50 transition">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Christian Music Specialist</h3>
              <p className="text-gray-400">
                Optimized for Christian music genres including worship, hip-hop, pop, and indie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: "Share Stats", desc: "Upload your Spotify screenshot or playlist link" },
              { step: 2, title: "AI Analysis", desc: "Our system analyzes your music preferences" },
              { step: 3, title: "Generate Recs", desc: "Discover tailored recommendations" },
              { step: 4, title: "Enjoy", desc: "Add songs to your playlists and discover new favorites" }
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-black/40 backdrop-blur border border-purple-500/20 rounded-lg p-6 text-center h-full flex flex-col justify-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
                {item.step < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-purple-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Discover New Music?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of music lovers finding their next favorite songs with AI-powered recommendations.
            </p>
            <a href="/app" className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-lg font-semibold transition transform hover:scale-105">
              Get Started Now <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-black/50 backdrop-blur py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-6 h-6 text-purple-400" />
                <span className="text-lg font-bold text-white">Spotify Recommender</span>
              </div>
              <p className="text-gray-400 text-sm">AI-powered music recommendations for Christian music lovers.</p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="/app" className="text-gray-400 hover:text-white transition">App</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">API Docs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition flex items-center gap-2">
                  <Github className="w-4 h-4" /> GitHub
                </a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Discord</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-purple-500/20 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2025 Spotify Recommender. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
