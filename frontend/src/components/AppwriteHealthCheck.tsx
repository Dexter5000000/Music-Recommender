import React, { useState } from 'react';
import client, { appwriteConfig } from '../services/appwrite';

/**
 * Test component to verify Appwrite connection
 */
export const AppwriteHealthCheck: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [message, setMessage] = useState('Checking Appwrite connection...');

  React.useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log('Starting Appwrite connection check...');
        console.log('Endpoint:', appwriteConfig.endpoint);
        console.log('Project ID:', appwriteConfig.projectId);
        
        // Test connection by making a simple HEAD request to the API endpoint
        const endpoint = appwriteConfig.endpoint;
        const projectId = appwriteConfig.projectId;
        
        // Construct a simple test URL
        const testUrl = `${endpoint}/health`;
        console.log('Testing URL:', testUrl);
        
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(testUrl, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'X-Appwrite-Project': projectId,
          },
        });
        
        clearTimeout(timeout);
        
        console.log('Response status:', response.status);
        console.log('Response statusText:', response.statusText);
        
        if (response.ok || response.status === 401 || response.status === 403) {
          // These responses mean the server is reachable
          console.log('✅ Appwrite server is reachable');
          setStatus('connected');
          setMessage('✅ Appwrite server is reachable');
        } else if (response.status === 0) {
          console.log('❌ CORS error or network unreachable');
          setStatus('error');
          setMessage('❌ CORS error or network unreachable');
        } else {
          console.log(`❌ Server returned status ${response.status}`);
          setStatus('error');
          setMessage(`❌ Server returned status ${response.status}`);
        }
      } catch (error: any) {
        console.error('Connection check error:', error);
        clearTimeout(undefined);
        
        if (error.name === 'AbortError') {
          console.log('❌ Connection timeout');
          setStatus('error');
          setMessage('❌ Connection timeout (server not responding)');
        } else if (error instanceof TypeError && error.message.includes('fetch')) {
          console.log('❌ Network error or CORS blocked');
          setStatus('error');
          setMessage('❌ Network error or CORS blocked');
        } else {
          console.log('❌ Error:', error.message);
          setStatus('error');
          setMessage(`❌ ${error.message || 'Failed to connect to Appwrite'}`);
        }
      }
    };

    checkConnection();
  }, []);

  const statusColors = {
    checking: 'bg-yellow-500',
    connected: 'bg-green-500',
    error: 'bg-red-500',
  };

  return (
    <div className={`${statusColors[status]} text-white px-4 py-2 rounded text-sm`}>
      {message}
    </div>
  );
};

export default AppwriteHealthCheck;
