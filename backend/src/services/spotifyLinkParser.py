import re
from typing import Optional, List, Dict
from spotapi import Song, Playlist

class SpotifyLinkParser:
    """
    Service for parsing Spotify links and extracting track/playlist data
    using SpotAPI for unauthenticated access
    """
    
    @staticmethod
    def extract_id_from_url(url: str) -> Optional[tuple]:
        """
        Extract Spotify ID and type from a URL
        Returns: (type, id) where type is 'track', 'playlist', or 'album'
        """
        # Pattern for track URL: https://open.spotify.com/track/7qiZfU4dY1lsylvNFoYL2E
        track_match = re.search(r'spotify\.com/track/([a-zA-Z0-9]+)', url)
        if track_match:
            return ('track', track_match.group(1))
        
        # Pattern for playlist URL: https://open.spotify.com/playlist/37i9dQZF1FoyQGyinuuvRu
        playlist_match = re.search(r'spotify\.com/playlist/([a-zA-Z0-9]+)', url)
        if playlist_match:
            return ('playlist', playlist_match.group(1))
        
        # Pattern for album URL: https://open.spotify.com/album/4OHKIK5Y2Fr7ruoSUAB2r3
        album_match = re.search(r'spotify\.com/album/([a-zA-Z0-9]+)', url)
        if album_match:
            return ('album', album_match.group(1))
        
        return None
    
    @staticmethod
    def get_track_info(track_id: str) -> Optional[Dict]:
        """
        Get track information from Spotify using SpotAPI
        Returns track metadata: name, artist, album, duration, etc.
        """
        try:
            song = Song()
            # SpotAPI search returns similar data to what we need
            results = song.query_songs(f"spotify:track:{track_id}", limit=1)
            
            if results and 'data' in results:
                items = results.get('data', {}).get('searchV2', {}).get('tracksV2', {}).get('items', [])
                if items and len(items) > 0:
                    track_data = items[0].get('item', {}).get('data', {})
                    return {
                        'id': track_id,
                        'title': track_data.get('name', 'Unknown'),
                        'artist': track_data.get('artistNames', ['Unknown'])[0] if track_data.get('artistNames') else 'Unknown',
                        'artists': track_data.get('artistNames', ['Unknown']),
                        'album': track_data.get('albumName', 'Unknown'),
                        'duration': track_data.get('duration', {}).get('totalMillis', 0),
                        'image': track_data.get('images', [{}])[0].get('url', '') if track_data.get('images') else '',
                    }
        except Exception as e:
            print(f"[SpotAPI] Error fetching track {track_id}: {str(e)}")
        
        return None
    
    @staticmethod
    def get_playlist_tracks(playlist_id: str, limit: int = 50) -> List[Dict]:
        """
        Get tracks from a Spotify playlist using SpotAPI
        Returns list of track metadata dictionaries
        """
        try:
            playlist = Playlist()
            # Get playlist items
            results = playlist.get_playlist(playlist_id)
            
            if results and 'data' in results:
                items = results.get('data', {}).get('playlistContents', {}).get('items', [])
                
                tracks = []
                for item in items[:limit]:
                    track_data = item.get('addedAt', {}).get('item', {}).get('data', {}) or item.get('item', {}).get('data', {})
                    if track_data:
                        tracks.append({
                            'id': track_data.get('id', ''),
                            'title': track_data.get('name', 'Unknown'),
                            'artist': track_data.get('artistNames', ['Unknown'])[0] if track_data.get('artistNames') else 'Unknown',
                            'artists': track_data.get('artistNames', ['Unknown']),
                            'album': track_data.get('albumName', 'Unknown'),
                            'duration': track_data.get('duration', {}).get('totalMillis', 0),
                        })
                
                return tracks
        except Exception as e:
            print(f"[SpotAPI] Error fetching playlist {playlist_id}: {str(e)}")
        
        return []
    
    @staticmethod
    def search_tracks(query: str, limit: int = 10) -> List[Dict]:
        """
        Search for tracks by query using SpotAPI
        Returns list of matching track metadata
        """
        try:
            song = Song()
            results = song.query_songs(query, limit=limit)
            
            if results and 'data' in results:
                items = results.get('data', {}).get('searchV2', {}).get('tracksV2', {}).get('items', [])
                
                tracks = []
                for item in items:
                    track_data = item.get('item', {}).get('data', {})
                    if track_data:
                        tracks.append({
                            'id': track_data.get('id', ''),
                            'title': track_data.get('name', 'Unknown'),
                            'artist': track_data.get('artistNames', ['Unknown'])[0] if track_data.get('artistNames') else 'Unknown',
                            'artists': track_data.get('artistNames', ['Unknown']),
                            'album': track_data.get('albumName', 'Unknown'),
                            'duration': track_data.get('duration', {}).get('totalMillis', 0),
                            'popularity': track_data.get('popularity', 0),
                        })
                
                return tracks
        except Exception as e:
            print(f"[SpotAPI] Error searching for '{query}': {str(e)}")
        
        return []
    
    @staticmethod
    def parse_spotify_link(url: str) -> Optional[Dict]:
        """
        Parse a Spotify link and return relevant track/playlist data
        Main entry point for using this parser
        """
        id_info = SpotifyLinkParser.extract_id_from_url(url)
        
        if not id_info:
            print(f"[SpotAPI] Could not parse Spotify URL: {url}")
            return None
        
        resource_type, resource_id = id_info
        
        if resource_type == 'track':
            track_info = SpotifyLinkParser.get_track_info(resource_id)
            if track_info:
                return {
                    'type': 'track',
                    'id': resource_id,
                    'data': track_info,
                    'tracks': [track_info],  # Single track as list for consistency
                }
        
        elif resource_type == 'playlist':
            tracks = SpotifyLinkParser.get_playlist_tracks(resource_id)
            if tracks:
                return {
                    'type': 'playlist',
                    'id': resource_id,
                    'tracks': tracks,
                    'track_count': len(tracks),
                }
        
        elif resource_type == 'album':
            # For now, treat album similar to playlist
            # In future, use Album class from SpotAPI
            return {
                'type': 'album',
                'id': resource_id,
                'tracks': [],
                'message': 'Album parsing coming soon'
            }
        
        return None


# Example usage (for testing):
if __name__ == '__main__':
    # Test parsing a playlist URL
    playlist_url = "https://open.spotify.com/playlist/37i9dQZF1FoyQGyinuuvRu"
    result = SpotifyLinkParser.parse_spotify_link(playlist_url)
    
    if result:
        print(f"Type: {result['type']}")
        print(f"Tracks found: {len(result.get('tracks', []))}")
        if result.get('tracks'):
            for i, track in enumerate(result['tracks'][:3]):
                print(f"  {i+1}. {track['title']} - {track['artist']}")
    
    # Test searching for tracks
    print("\nSearching for 'Christian pop'...")
    tracks = SpotifyLinkParser.search_tracks('Christian pop', limit=5)
    for i, track in enumerate(tracks):
        print(f"  {i+1}. {track['title']} - {track['artist']}")
