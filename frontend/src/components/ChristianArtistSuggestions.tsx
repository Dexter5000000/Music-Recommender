import React from 'react';
import { Heart, Music } from 'lucide-react';

interface ChristianArtistSuggestionsProps {
  artists?: string[];
  message?: string;
  loading?: boolean;
}

export default function ChristianArtistSuggestions({
  artists = [],
  message = 'Here are some Christian artists with similar styles',
  loading = false,
}: ChristianArtistSuggestionsProps) {
  if (!artists || artists.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/30 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Christian Music Alternatives</h3>
      </div>
      
      <p className="text-sm text-gray-300 mb-4">{message}</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {artists.map((artist, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-black/30 rounded-lg hover:bg-black/50 transition cursor-pointer group"
          >
            <Music className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition" />
            <div className="flex-1">
              <p className="font-medium text-white group-hover:text-blue-300 transition">
                {artist}
              </p>
              <p className="text-xs text-gray-500">Christian Music Archive</p>
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 mt-4">
        🔗 View more artists on{' '}
        <a
          href="https://www.christianmusicarchive.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition"
        >
          Christian Music Archive
        </a>
      </p>
    </div>
  );
}
